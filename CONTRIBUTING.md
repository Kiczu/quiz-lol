# Code conventions

- Use arrow functions assigned to `const`, including components, hooks and callbacks.
- Keep service methods local and export one named service object at the end of the file: `export const userService = { getUserData }`.
- Use named exports for shared types, constants and small utilities. Components and hooks follow the neighbouring files' default-export convention.
- Firebase function entry points remain named exports so deployment can discover them.
- Follow the surrounding indentation, import groups, naming and `*.style.ts` layout. Keep JSX readable rather than compressing it into one line.
- Share repeated behaviour when it has multiple real callers. Do not introduce general frameworks for a single use case.
- Keep browser code separate from privileged Firebase code. Never expose answer secrets or trust client-side scoring.
- Do not add code comments unless the change specifically calls for them.

## Changes and history

- Use a separate `feat/`, `fix/`, `refactor/` or `chore/` branch for each concern.
- Keep tests with the code they cover. Use short conventional commit subjects with a scope.
- Dependent branches may form a stack; review and merge them in base-to-tip order.
- Rewrite only unpublished commits, with a local backup before rebasing.
- Merge with `--no-ff` only after review. Do not push or merge as part of preparing a change.

## Verification

Run `npm run lint`, `npm run test:run` and `npm run build` for frontend changes.
Run `npm run test:backend` for Functions, shared contracts or Firestore changes.
`npm run test:emulator:live` also verifies the current Data Dragon data.
Emulator tests use an isolated demo project and must never target production.
