export const pvpRules = {
  totalRounds: 5,
  pointsPerAnswer: 10,
  rankingStake: 20,
  rematchCooldown: 24 * 60 * 60_000,
  roundDuration: 60_000,
  roundBreakDuration: 5_000,
  reconnectWindow: 60_000,
  heartbeatInterval: 15_000,
  searchLeaseDuration: 45_000,
  searchPollInterval: 10_000,
  activityPollInterval: 30_000,
} as const;

export type QuizChoice = { id: string; name: string; icon?: string };

export type QuizQuestion = {
  category: string;
  prompt: string;
  image: string | null;
  text: string | null;
  dataVersion: string;
  options: QuizChoice[];
};

export type PvpQuestion = QuizQuestion | {
  spellName: string;
  spellIcon: string;
  options: { id: string; name: string; icon: string }[];
};

export type PvpPlayer = { uid: string; name: string; score: number };

export type PvpRoom = {
  mode?: "private" | "ranked";
  rankingChanges?: Record<string, number>;
  unrankedReason?: "early" | "rematch";
  endReason?: "score" | "forfeit" | "disconnect" | "abandoned";
  status: "waiting" | "playing" | "finished" | "cancelled";
  playerIds: string[];
  players: PvpPlayer[];
  currentRound: number;
  totalRounds: number;
  question: PvpQuestion | null;
  answeredIds: string[];
  deadline: number | null;
  nextRoundAt?: number | null;
  roundResult?: {
    winnerId: string | null;
    answer: { id: string; name: string };
    correctIds: string[];
  } | null;
  expiresAt: number;
  winnerId: string | null;
};

export type PvpActivity = { searching: number; playing: number };

export type PvpSearchResult = { state: "waiting" | "matched" | "cancelled"; code: string | null };
export type PvpSearch = PvpSearchResult & { searchId: string; expiresAt: number };
