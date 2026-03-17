import { eventDispatcher } from "../events/event-dispatcher";
import { Dictionary, loadDictionary } from "./load-dictionary";
import { ScreenName, Difficulty, CONFIG } from "./types";
import { Breach, BreachDTO } from "./breach";

class Game {
  // One source of truth for the current screen being shown
  currentScreen: ScreenName = "loading";

  // There might not be a breach started yet
  breach?: Breach;

  // Levels require this
  dictionary!: Dictionary;

  async load() {
    // Track time it took to load
    const startedLoad = performance.now();

    // Load dictionary
    this.dictionary = await loadDictionary();

    // Load any persisted state from a previous session
    const dto = this.getSavedBreachDTO();
    if (dto)
      this.breach = new Breach(
        dto.difficulty,
        this.dictionary,
        this.changeScreen,
        dto,
      );

    const loadingTime = performance.now() - startedLoad;

    // Allow 2 seconds for splash screen to show
    const minTimeToShow = 2000;
    const swapScreenDelay = minTimeToShow - loadingTime;
    setTimeout(() => {
      // Now move to next screen
      if (this.breach) {
        this.changeScreen(
          this.breach.breachResult ? "breach-over" : "breach-progress",
        );
      } else {
        this.changeScreen("breach-select");
      }
    }, swapScreenDelay);
  }

  getBreachOptions(): { difficulty: Difficulty; levelCount: number }[] {
    return [
      {
        difficulty: "easy",
        levelCount: CONFIG["easy"].levelCount,
      },
      {
        difficulty: "medium",
        levelCount: CONFIG["medium"].levelCount,
      },
      {
        difficulty: "hard",
        levelCount: CONFIG["hard"].levelCount,
      },
    ];
  }

  initiateBreach(difficulty: Difficulty) {
    this.breach = new Breach(difficulty, this.dictionary, this.changeScreen);

    this.breach.save();

    // Change to progress screen
    this.changeScreen("breach-progress");
  }

  finishBreach() {
    // Clear last run data
    this.breach = undefined;
    this.clearSavedBreach();

    this.changeScreen("breach-select");
  }

  private changeScreen = (screenName: ScreenName) => {
    this.currentScreen = screenName;
    eventDispatcher.fire("screen-changed", null);
  };

  private getSavedBreachDTO(): BreachDTO | undefined {
    // When testing, return manually created state here
    const testing = false;

    const testBreach: BreachDTO = {
      version: "test",
      difficulty: "easy",
      seed: 1234,
      corePassword: "ABCD",
      levels: [],
      levelStats: [],
      nextLevelPointer: 0,
      hintPool: [],
      awardedHints: [],
      exploitTokens: 0,
    };

    if (testing) return testBreach;

    // Load saved breach from localStorage
    const data = localStorage.getItem("savedBreach");
    if (data) {
      const breach: BreachDTO = JSON.parse(data);

      // Old version no good
      if (__APP_VERSION__ !== breach.version) return undefined;

      return breach;
    }

    return undefined;
  }

  private clearSavedBreach() {
    localStorage.removeItem("savedBreach");
  }
}

export const game = new Game();
