export type ScreenName =
  | "loading"
  | "breach-select"
  | "breach-progress"
  | "level"
  | "core-access"
  | "breach-over"
  | "memory-defrag-level"
  | "word-transform-level";

export type Difficulty = "easy" | "medium" | "hard";

export type Level = {
  screen: ScreenName;
  baseXp: number;
  difficulty: Difficulty;
};

export type VictoryResult = "win" | "lose";
export type BreachResult = VictoryResult | "abandoned";

export interface LevelStats {
  screen: ScreenName;
  result: VictoryResult;
  gainedXp: number;
}

export const CONFIG = {
  easy: {
    levelCount: 3,
    startingTokens: 1,
  },
  medium: {
    levelCount: 4,
    startingTokens: 2,
  },
  hard: {
    levelCount: 5,
    startingTokens: 3,
  },
};

export const levelTypes: ScreenName[] = ["memory-defrag-level"];

export const levelDifficulties: Record<Difficulty, Difficulty[]> = {
  easy: ["easy", "medium", "hard"],
  medium: ["easy", "easy", "medium", "medium", "hard"],
  hard: ["easy", "medium", "medium", "hard", "hard"],
};
