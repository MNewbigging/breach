import { eventDispatcher } from "../events/event-dispatcher";
import { generateCorePassword } from "./core-password-generator";
import { loadDictionary } from "./load-dictionary";
import {
  getExactLengthVulnSpec,
  getVulnerabilitySpecs,
  VulnerabilitySpec,
} from "./vulnerability-generator";

type SceenName =
  | "loading"
  | "breach-select"
  | "breach-progress"
  | "level"
  | "core-access"
  | "breach-over";

export type VictoryResult = "win" | "lose";
export type BreachResult = VictoryResult | "abandoned";

export interface SecurityLayerResult {
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
  securityLayerResults: SecurityLayerResult[];
  corePassword: string;
  vulnPool: VulnerabilitySpec[];
  awardedVulns: VulnerabilitySpec[];
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
    const corePassword = generateCorePassword();
    const vulnPool = getVulnerabilitySpecs(corePassword);
    // Always start with length vuln
    const awardedVulns = [getExactLengthVulnSpec(corePassword)];

    // Setup the full breach object using selected option
    this.currentBreach = {
      ...breachOption,
      nextLayerPointer: 0,
      securityLayerResults: [],
      corePassword,
      vulnPool,
      awardedVulns
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

  concludeLayer(stats: SecurityLayerResult) {
    const breach = this.currentBreach;
    if (!breach) return;

    // Save stats of the finished layer
    breach.securityLayerResults.push(stats);

    // Point to next layer
    breach.nextLayerPointer++;

    // Award a vulnerability if won
    if (stats.result === "win") {
      this.awardVulnerability(breach);
    }

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

    try {
      const data = JSON.stringify(breach);
      localStorage.setItem("savedBreach", data);
    } catch (e) {
      console.error(`Failed to save breach data: ${e}`);
    }
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

  private awardVulnerability(breach: Breach) {
    // I award a v based on how much I want to reduce search space at this time

    // Remove a v from the pool and add to awarded list
    const rnd = Math.floor(Math.random() * breach.vulnPool.length);
    const removed = breach.vulnPool.splice(rnd, 1);
    breach.awardedVulns.push(removed[0]);
  }
}

export const game = new Game();
