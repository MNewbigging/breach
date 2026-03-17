import { getExactLengthHintSpec, getHintSpecs } from "./hints/generate";
import { HintSpec } from "./hints/spec";
import { Dictionary } from "./load-dictionary";
import {
  randomIndex,
  randomLetterString,
  randomSeed,
  rngFunctionFromSeed,
  splitmix32,
} from "./seeded-random";
import {
  BreachResult,
  CONFIG,
  Difficulty,
  Level,
  LevelStats,
  ScreenName,
} from "./types";

export interface BreachDTO {
  version: string;
  difficulty: Difficulty;
  seed: number;
  corePassword: string;
  levels: Level[];
  levelStats: LevelStats[];
  nextLevelPointer: number;
  hintPool: HintSpec[];
  awardedHints: HintSpec[];
  exploitTokens: number;
  breachResult?: BreachResult;
}

export class Breach {
  seed: number = 0;
  corePassword: string = "";
  levels: Level[] = [];
  levelStats: LevelStats[] = [];
  hintPool: HintSpec[] = [];
  awardedHints: HintSpec[] = [];
  exploitTokens: number = 0;
  breachResult?: BreachResult;

  private nextLevelPointer = 0;

  constructor(
    public readonly difficulty: Difficulty, // used to determine number of security levels & their base difficulty
    private readonly dictionary: Dictionary,
    private readonly changeScreen: (screen: ScreenName) => void,
    dto?: BreachDTO,
  ) {
    // Either load from DTO or setup new default values
    if (dto) {
      this.fromDTO(dto);
    } else {
      this.setup();
    }
  }

  canAffordExploit(cost: number) {
    return this.exploitTokens >= cost;
  }

  spendTokens(cost: number) {
    this.exploitTokens -= cost;
  }

  getNextLevel() {
    return this.levels[this.nextLevelPointer];
  }

  getNextLevelSeed() {
    return splitmix32((this.seed + this.nextLevelPointer) >>> 0);
  }

  // todo should this be on the level object instead?
  getNextLevelDifficulty() {
    if (this.difficulty === "easy") {
      // Easy has 3 levels... this shouldn't be so hardcoded!
      const easyScale: Difficulty[] = ["easy", "medium", "hard"];
      return easyScale[this.nextLevelPointer];
    }

    if (this.difficulty === "medium") {
      const mediumScale: Difficulty[] = [
        "easy",
        "easy",
        "medium",
        "medium",
        "hard",
      ];
      return mediumScale[this.nextLevelPointer];
    }

    const hardScale: Difficulty[] = [
      "easy",
      "medium",
      "medium",
      "hard",
      "hard",
    ];
    return hardScale[this.nextLevelPointer];
  }

  save() {
    try {
      const data = JSON.stringify(this.toDTO());
      localStorage.setItem("savedBreach", data);
    } catch (e) {
      console.error(`Failed to save breach data: ${e}`);
    }
  }

  abandon() {
    this.breachResult = "abandoned";
    this.changeScreen("breach-over");
  }

  startNextLevel() {
    this.changeScreen(this.getNextLevel().screen);
  }

  concludeLevel = (stats: LevelStats) => {
    // Record the results of the level
    this.levelStats.push(stats);

    // If there is another level to go, increase the pointer
    if (this.nextLevelPointer < this.levels.length - 1) this.nextLevelPointer++;

    if (stats.result === "win") {
      this.awardHint();
      this.awardExploitTokens();
    }

    this.save();

    // Was it the last level?
    if (stats.screen === "core-access") {
      this.breachResult = stats.result;
      this.changeScreen("breach-over");
    } else {
      this.changeScreen("breach-progress");
    }
  };

  private awardHint() {
    const rnd = Math.floor(Math.random() * this.hintPool.length);
    const removed = this.hintPool.splice(rnd, 1);
    this.awardedHints.push(removed[0]);
  }

  private awardExploitTokens() {
    this.exploitTokens += 2;
  }

  private setup() {
    // Each breach has its own random seed used in all breach content random generation
    this.seed = randomSeed();
    const rng = rngFunctionFromSeed(this.seed);

    // Core password is generated immediately in order to inform hint choices
    // Password should be a word from the dictionary
    this.corePassword = this.generatePassword(); //randomLetterString(rng, 4);

    this.hintPool = getHintSpecs(this.corePassword, this.seed);
    this.awardedHints = [getExactLengthHintSpec(this.corePassword)]; // length hint is given at start

    // Generate levels
    this.levels = this.generateLevels(this.difficulty);

    // Starting tokens
    this.exploitTokens = CONFIG[this.difficulty].startingTokens;
  }

  private generatePassword() {
    const length =
      this.difficulty === "easy" ? 4 : this.difficulty === "medium" ? 5 : 6;
    const words = this.dictionary.wordsByLength.get(length)!;

    const rng = rngFunctionFromSeed(this.seed);
    return words[randomIndex(rng, words.length)].toUpperCase();
  }

  private generateLevels(difficulty: Difficulty) {
    const rng = rngFunctionFromSeed(this.seed);
    const levelChoices = getLevelChoices();
    const levelCount = CONFIG[difficulty].levelCount;

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

  private toDTO(): BreachDTO {
    const {
      difficulty,
      seed,
      corePassword,
      levels,
      levelStats,
      nextLevelPointer,
      hintPool,
      awardedHints,
      exploitTokens,
    } = this;

    return {
      version: __APP_VERSION__,
      difficulty,
      seed,
      corePassword,
      levels,
      levelStats,
      nextLevelPointer,
      hintPool,
      awardedHints,
      exploitTokens,
    };
  }

  private fromDTO(dto: BreachDTO) {
    this.seed = dto.seed;
    this.corePassword = dto.corePassword;
    this.levels = dto.levels;
    this.levelStats = dto.levelStats;
    this.nextLevelPointer = dto.nextLevelPointer;
    this.hintPool = dto.hintPool;
    this.awardedHints = dto.awardedHints;
    this.exploitTokens = dto.exploitTokens;
    this.breachResult = dto.breachResult;
  }
}

// todo - possibly define elsewhere?
function getLevelChoices(): Level[] {
  return [
    // {
    //   screen: "word-transform-level",
    //   baseXp: 1,
    // },
    {
      screen: "memory-defrag-level",
      baseXp: 1,
    },
  ];
}
