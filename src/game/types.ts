export type ScreenName =
  | "loading"
  | "breach-select"
  | "breach-progress"
  | "level"
  | "core-access"
  | "breach-over"
  | "memory-defrag-level";

export type Difficulty = "easy" | "medium" | "hard";

export type Level = {
  screen: ScreenName;
  baseXp: number;
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
