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
  breachResult?: VictoryResult;
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
    // todo

    const loadingTime = performance.now() - startedLoad;

    // Allow 2 seconds for splash screen to show
    const minTimeToShow = 2000;
    const swapScreenDelay = minTimeToShow - loadingTime;
    setTimeout(() => {
      // Now move to next screen
      this.changeScreen("breach-select");
    }, swapScreenDelay);
  }

  getSystemOptions(): BreachOption[] {
    const securityLayers: SecurityLayer[] = [
      {
        name: "Layer 1",
        baseXp: 1,
      },
      {
        name: "Layer 2",
        baseXp: 1,
      },
      {
        name: "Layer 3",
        baseXp: 1,
      },
    ];

    const options: BreachOption[] = [
      {
        systemName: "Helios System",
        securityLayers,
      },
      {
        systemName: "Argos System",
        securityLayers,
      },
      {
        systemName: "Blit System",
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

    this.changeScreen("breach-progress");
  }

  accessCore() {
    this.changeScreen("core-access");
  }

  concludeCore(result: VictoryResult) {
    const breach = this.currentBreach;
    if (!breach) return;

    breach.breachResult = result;
    this.changeScreen("breach-over");
  }

  finishBreach() {
    // Clear last run data
    this.currentBreach = undefined;

    this.changeScreen("breach-select");
  }

  private changeScreen(screenName: SceenName) {
    this.currentScreen = screenName;
    eventDispatcher.fire("screen-changed", null);
  }
}

export const game = new Game();
