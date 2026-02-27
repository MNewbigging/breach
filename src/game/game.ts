import { eventDispatcher } from "../events/event-dispatcher";
import { loadDictionary } from "./load-dictionary";

type SceenName =
  | "loading"
  | "breach-select"
  | "breach-progress"
  | "level"
  | "core-access"
  | "breach-over";

export type VictoryResult = "win" | "lose";
export type BreachResult = VictoryResult | "abandoned";

export interface SecurityLayerStats {
  result: VictoryResult;
  gainedXp: number;
}

export interface SecurityLayer {
  name: string;
  baseXp: number;
}

export interface BreachOption {
  systemName: string;
  securityLayers: SecurityLayer[];
}

export interface Breach extends BreachOption {
  nextLayerPointer: number;
  securityLayerStats: SecurityLayerStats[];
  breachResult?: BreachResult;
}

class Game {
  currentScreen: SceenName = "loading";
  currentBreach?: Breach;

  private dictionary?: Set<string>;

  async load() {
    // Track time it took to load
    const startedLoad = performance.now();

    // Load dictionary
    this.dictionary = await loadDictionary();

    // Load any persisted state from a previous session
    const savedBreach = this.getSavedBreach();
    if (savedBreach) this.currentBreach = savedBreach;

    const loadingTime = performance.now() - startedLoad;

    // Allow 2 seconds for splash screen to show
    const minTimeToShow = 2000;
    const swapScreenDelay = minTimeToShow - loadingTime;
    setTimeout(() => {
      // Now move to next screen
      if (this.currentBreach) {
        this.changeScreen(
          this.currentBreach.breachResult ? "breach-over" : "breach-progress",
        );
      } else {
        this.changeScreen("breach-select");
      }
    }, swapScreenDelay);
  }

  getSystemOptions(): BreachOption[] {
    const securityLayers: SecurityLayer[] = [
      {
        name: "Layer 1",
        baseXp: 1,
      },
      // {
      //   name: "Layer 2",
      //   baseXp: 1,
      // },
      // {
      //   name: "Layer 3",
      //   baseXp: 1,
      // },
    ];

    const options: BreachOption[] = [
      {
        systemName: "Helios",
        securityLayers,
      },
      {
        systemName: "Argos",
        securityLayers,
      },
      {
        systemName: "Blit",
        securityLayers,
      },
    ];

    return options;
  }

  initiateBreach(breachOption: BreachOption) {
    // Setup the full breach object using selected option
    this.currentBreach = {
      ...breachOption,
      nextLayerPointer: 0,
      securityLayerStats: [],
    };

    this.saveBreach();

    // Change to progress screen
    this.changeScreen("breach-progress");
  }

  nextLayer() {
    if (!this.currentBreach) return;

    // For now
    this.changeScreen("level");
  }

  concludeLayer(stats: SecurityLayerStats) {
    const breach = this.currentBreach;
    if (!breach) return;

    // Save stats of the finished layer
    breach.securityLayerStats.push(stats);

    // Point to next layer
    breach.nextLayerPointer++;

    // Save progress
    this.saveBreach();

    this.changeScreen("breach-progress");
  }

  accessCore() {
    this.changeScreen("core-access");
  }

  concludeCore(result: VictoryResult) {
    const breach = this.currentBreach;
    if (!breach) return;

    breach.breachResult = result;
    this.saveBreach();
    this.changeScreen("breach-over");
  }

  finishBreach() {
    // Clear last run data
    this.currentBreach = undefined;
    this.clearSavedBreach();

    this.changeScreen("breach-select");
  }

  abandonBreach() {
    const breach = this.currentBreach;
    if (!breach) return;

    breach.breachResult = "abandoned";
    this.changeScreen("breach-over");
  }

  private changeScreen(screenName: SceenName) {
    this.currentScreen = screenName;
    eventDispatcher.fire("screen-changed", null);
  }

  private saveBreach() {
    const breach = this.currentBreach;
    if (!breach) return;

    const data = JSON.stringify(breach);
    localStorage.setItem("savedBreach", data);
  }

  private getSavedBreach() {
    const data = localStorage.getItem("savedBreach");
    if (data) {
      const breach: Breach = JSON.parse(data);
      return breach;
    }

    return undefined;
  }

  private clearSavedBreach() {
    localStorage.removeItem("savedBreach");
  }
}

export const game = new Game();
