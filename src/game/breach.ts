import {
  randomIndex,
  randomLetterString,
  randomSeed,
  rngFunctionFromSeed,
} from "./seeded-random";
import { Difficulty, Level } from "./types";

export class Breach {
  seed: number;
  corePassword: string;
  levels: Level[];

  constructor(
    public readonly systemName: string, // displayed prior to breach starting, so it's given to the breach
    public readonly difficulty: Difficulty, // used to determine number of security levels & their base difficulty
  ) {
    // Each breach has its own random seed used in all breach content random generation
    this.seed = randomSeed();
    const rng = rngFunctionFromSeed(this.seed);

    // Core password is generated immediately, in order to inform hint choices
    this.corePassword = randomLetterString(rng, 4);

    // Generate levels
    this.levels = this.generateLevels(difficulty);

    // Length hint is given at start
  }

  private generateLevels(difficulty: Difficulty) {
    const rng = rngFunctionFromSeed(this.seed);
    const levelChoices = getLevelChoices();
    const levelCount = getLevelCountForDifficulty(difficulty);

    const levels: Level[] = [];
    for (let i = 0; i < levelCount; i++) {
      // Randomly pick the levels using rng function
      const idx = randomIndex(rng, levelChoices.length);
      levels.push(levelChoices[idx]);
    }

    // Core access level is always last
    levels.push({ screen: "core-access", baseXp: 1 });

    return levels;
  }
}

function getLevelCountForDifficulty(difficulty: Difficulty): number {
  if (difficulty === "easy") return 3;
  if (difficulty === "medium") return 4;
  return 5;
}

function getLevelChoices(): Level[] {
  return [
    {
      screen: "memory-defrag-level",
      baseXp: 1,
    },
  ];
}
