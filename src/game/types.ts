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
