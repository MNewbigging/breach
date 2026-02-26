import { eventDispatcher } from "../events/event-dispatcher";
import { loadDictionary } from "./load-dictionary";

class Game {
  private dictionary?: Set<string>;

  async load() {
    // Track time it took to load
    const startedLoad = performance.now();

    this.dictionary = await loadDictionary();

    const loadingTime = performance.now() - startedLoad;

    // Allow 2 seconds for splash screen to show
    const minTimeToShow = 2000;
    const swapScreenDelay = minTimeToShow - loadingTime;
    setTimeout(() => {
      // Now move to next screen
      eventDispatcher.fire("screen-changed", null);
    }, swapScreenDelay);
  }
}

export const game = new Game();
