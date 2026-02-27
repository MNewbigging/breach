import { eventDispatcher } from "../events/event-dispatcher";
import { loadDictionary } from "./load-dictionary";

type SceenName = "loading" | "breach-select" | "breach-progress";

export interface SecurityLayer {
  name: string;
}

export interface BreachOption {
  systemName: string;
  securityLayers: SecurityLayer[];
}

export interface Breach extends BreachOption {
  nextLayerPointer: number;
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
      },
      {
        name: "Layer 2",
      },
      {
        name: "Layer 3",
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
    this.currentBreach = { ...breachOption, nextLayerPointer: 0 };

    // Change to progress screen
    this.changeScreen("breach-progress");
  }

  private changeScreen(screenName: SceenName) {
    this.currentScreen = screenName;
    eventDispatcher.fire("screen-changed", null);
  }
}

export const game = new Game();
