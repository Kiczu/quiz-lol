# Quiz-LoL

[![CI](https://github.com/Kiczu/quiz-lol/actions/workflows/ci.yml/badge.svg)](https://github.com/Kiczu/quiz-lol/actions/workflows/ci.yml)

A League of Legends quiz app: three solo game modes, online and private PvP duels, user accounts, a leaderboard
and a champion browser. Champion data comes from Riot's Data Dragon; everything that
decides whether an answer is correct runs on the server, not in the browser.

Built as a portfolio project, with a custom League-inspired UI.

![Home screen with the four game modes](docs/screenshots/home.webp)

## Demo

Not deployed yet.

## Game modes

| Mode | You see | You answer with | Scoring | Lives |
|---|---|---|---|---|
| **Hangman** | a masked champion name | one letter at a time | 1 per distinct correct letter, +10 for solving | 6 |
| **Regions** | a champion portrait | one of the 13 regions of Runeterra | 10 / 6 / 3 by wrong guesses | 3 |
| **Skills** | an ability icon and name | one of four champions | 10 / 6 / 3 by wrong guesses | 3 |
| **PVP** | the same mixed-category quiz as your opponent | one of four answers, once per round | 10 per correct answer across 5 rounds; separate ranked rewards | 60 seconds per round |

Choose **Find opponent** to join the public PVP queue. Two signed-in players searching
at the same time are paired automatically; being signed in alone does not join the queue.
Keep the page open while searching. Requests renew every ten seconds and expire after
45 seconds without a renewal, so disconnected players stop being eligible. **Cancel search**
leaves the queue; if a match has already been created, it opens that match instead.

For a private duel, create a room and share its six-character code with a second
signed-in player. The match starts when they join. Both players answer the same five
questions; points and correctness stay hidden until both answers are in or time runs out.
After a timeout, either player can select **Time is up — continue**; unanswered questions
score zero. Equal final scores are a draw. Match scores are separate from ranking points:

- Public matches award the winner 20 ranking points and deduct up to 20 from the loser.
  PVP ranking points never fall below zero. Draws change neither player's ranking.
- Private matches never affect either the PVP or total leaderboard. Leaving cancels them.
- Leaving a public match forfeits it, regardless of the current quiz score.
- Public matches renew presence every 15 seconds. A player has 60 seconds to reconnect;
  after that they forfeit. If both players are absent, both lose up to 20 points and
  neither receives a reward. Presence checks, answers and the next queue request settle
  these outcomes; there is no background scheduler when both browsers are closed.

The match result records each player's actual ranking change. TotalScore changes by
the same amount as PVP, so a loss never spends points earned in solo modes. Existing
scores are retained; rooms created before the ranked/private distinction are unranked.

Each new match draws five distinct categories from abilities/passives, champion regions,
items, champion titles, lore excerpts and summoner spells. Both players receive the same
questions and four-choice answers. Correct answers remain in the server-only secret document.
Data Dragon supplies the content and assets, with one pinned data version per match;
the existing `championRegions` collection supplies region associations. This is template
generation, not live AI-generated trivia. Lore excerpts omit the champion's name.
Item questions use purchasable Summoner's Rift items and exclude special upgrades and
duplicate names. Icon-identification questions use text-only answers to avoid revealing
the choice through a matching image. Regions are skipped when there is no valid mapping;
insufficient remaining categories produce a retryable error, not repeated questions.

Refreshing keeps the room through the page URL. Rooms expire after an hour. This first
version has no skill-based matchmaking, repeated-opponent protection or rematch voting.
Expiry prevents further play; it does not delete room documents from Firestore.

| Hangman | Regions | Skills |
|---|---|---|
| ![Hangman](docs/screenshots/hangman.webp) | ![Regions](docs/screenshots/regions.webp) | ![Skills](docs/screenshots/skills.webp) |

## Features

- Sign in with email and password or with Google, password reset, email verification
- User dashboard: avatar, profile details, password change, per-mode scores, account deletion
- Leaderboard per game mode and by total score
- Champion browser with search, and a detail page per champion with abilities and splash art

## Screenshots

| Leaderboard | Champion browser |
|---|---|
| ![Leaderboard](docs/screenshots/ranking.webp) | ![Champion browser](docs/screenshots/lore.webp) |

| Champion detail | User dashboard |
|---|---|
| ![Champion detail](docs/screenshots/champion.webp) | ![User dashboard](docs/screenshots/dashboard.webp) |

| Sign in | |
|---|---|
| ![Sign in](docs/screenshots/login.webp) | |

## Architecture

The app is two deployables in one repository.

`src/` is the React client. `functions/` is a separate Node project deployed to Cloud
Functions, and it owns every decision that affects a score:

- `startRound` picks the champion, builds the question and stores the answer in a
  `secret` subdocument. The client receives the question only - never the answer.
- `submitGuess` checks the guess against that subdocument, counts the wrong guesses,
  decides when the round is over and writes the score with the admin SDK.

`firestore.rules` closes the `rounds` collection to every client and freezes `totalScore`
and `scores` on the public profile, so a player can edit their username and avatar but
cannot write their own points directly. Finishing a round and awarding its points share
one Firestore transaction. Repeated solo submissions return the stored result without
awarding points again.

PVP has separate room callables and a live Firestore subscription. Only participants can
read their room; no client can read its secret questions or write match state. The server
enforces membership, answer limits, deadlines and the final ranking update. GameBox renders
the room's server-controlled phase, including its lobby and draw-aware result screen.

`findPvpMatch` and `cancelPvpSearch` manage one queue ticket per account. Matching consumes
both tickets and creates the room in one transaction. Only the ticket owner can read it;
clients cannot list the queue or write tickets. The queue is shared by clients connected
to the same Firebase project (or the same emulator), not between development and production.

## Tech stack

- **React 18 + TypeScript**, **Vite** as the build tool
- **Material-UI** with a custom League-inspired theme, **framer-motion** for animation
- **React Router**, **Formik** and **Yup** for forms and validation
- **Firebase**: Authentication, Firestore, Cloud Functions (Node 22, TypeScript)
- **Vitest** and **Testing Library** for tests, **ESLint** for linting
- **GitHub Actions** running lint, tests, both builds and emulator tests on pull requests and pushes to main

## Getting started

The repository is wired to one Firebase project, so a fresh clone needs its own:

1. Create a Firebase project and enable Authentication, Firestore and Cloud Functions
   (Cloud Functions require the Blaze plan).
2. Replace the values in `src/api/firebase/firebaseConfig.ts` with your own web config.
3. Put your project id in `.firebaserc`.
4. Install dependencies and start the dev server:

```
npm install
npm install --prefix functions
npm run dev
```

To deploy the backend:

```
npx firebase deploy --only functions,firestore:rules
```

## Local development with the Firebase emulators

The game modes run on Cloud Functions, so the app needs a backend even in development.
The emulator suite provides one locally, with its own database and its own user accounts,
so nothing you do while developing touches production.

One-time setup:

- Install dependencies in both projects: `npm install` and `npm install --prefix functions`.
- Install JDK 21 and make sure `java -version` works. Firestore needs Java; Firebase CLI
  is included in this project's dev dependencies.
- Node 22 matches the deployed Functions runtime.

Then:

```
npm run emulators
```

That builds `functions/`, starts Auth, Firestore and Functions, and puts the emulator UI
on http://127.0.0.1:4000. On the first run it seeds the `championRegions` collection from
the live project, which the Regions mode needs in order to pick a champion. On exit it
writes the whole local state - including the accounts you registered - to
`.emulator-data`, and imports it again next time, so you only register once. Use
`npm run seed:emulator` if you ever need to refresh that collection by hand.

`npm run dev` connects to the emulators automatically. Register an account through the app
the first time; it lives only in the emulator. To run the dev server against the live
project instead, put `VITE_USE_EMULATORS=false` in `.env.local`.

To try PVP on one computer:

1. Keep `npm run emulators` running in one terminal and `npm run dev` in another.
2. Open the app in a normal browser window and a private window, or two browser profiles.
3. Register or sign in to a different local account in each window. Two regular tabs
   share the same login and cannot play against each other.
4. Choose PVP and **Find opponent** in both windows. The match starts automatically.
   Alternatively, create a private room in one window and enter its code in the other.
5. Play five rounds and check the PVP ranking.

The game data and images still come from Data Dragon, so an internet connection is needed.
When changing backend TypeScript, run `npm --prefix functions run build`; the running
Functions emulator reloads the compiled JavaScript.

`npm run test:backend` builds the functions, starts isolated emulators for a demo project,
runs transaction and security-rule tests, and shuts that test suite down. Its separate ports
are configured in `firebase.test.json`, so it can run alongside the development emulators.
The tests use deterministic fixtures and do not need Data Dragon. `npm run test:emulator:live`
starts its own isolated demo emulators and also checks real question generation, public
matchmaking and complete public/private mixed quizzes. Run these two suites separately because
they share test ports. Test accounts and documents are removed at the end of the run.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | type-check and build the client |
| `npm run test` / `npm run test:run` | Vitest, watch mode / single run |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run emulators` | build `functions/` and start the emulator suite |
| `npm run seed:emulator` | copy `championRegions` into a running emulator |
| `npm run test:backend` | run isolated backend and security-rule tests |
| `npm run test:emulator:live` | test all games with isolated emulators and live Data Dragon questions |
| `npm run images` | optimise images in `src/assets` |

## Roadmap

- PVP skill-based matchmaking, repeated-opponent protection and rematches
- In-app notifications after actions
- Achievements and seasonal challenges
- Accessibility pass

## Author

Built by [Kiczu](https://github.com/Kiczu).
