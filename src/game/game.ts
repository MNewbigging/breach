import { eventDispatcher } from "../events/event-dispatcher";
import { loadDictionary } from "./load-dictionary";

type SceenName = "loading" | "system-select";

export interface SystemOption {
  name: string;
}

class Game {
  currentScreen: SceenName = "loading";

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
      this.currentScreen = "system-select";
      eventDispatcher.fire("screen-changed", null);
    }, swapScreenDelay);
  }

  getSystemOptions(): SystemOption[] {
    const options: SystemOption[] = [
      {
        name: "Helios System",
      },
      {
        name: "Argos System",
      },
      {
        name: "Blit System",
      },
    ];

    return options;
  }

  private getSystemTarget() {}
}

export const game = new Game();
