import { eventDispatcher } from "../events/event-dispatcher";
import { generateCorePassword } from "./core-password-generator";
import { Dictionary, loadDictionary } from "./load-dictionary";
import { MemoryDefragLevel } from "./memory-defrag-level";
import { splitmix32 } from "./seeded-random";
import {
  getVulnerabilitySpecs,
  getExactLengthVulnSpec,
} from "./vulns/generate";
import { VulnerabilitySpec } from "./vulns/spec";

export type SceenName =
  | "loading"
  | "breach-select"
  | "breach-progress"
  | "level"
  | "core-access"
  | "breach-over"
  | "memory-defrag-level";

export type VictoryResult = "win" | "lose";
export type BreachResult = VictoryResult | "abandoned";

export interface SecurityLayerResult {
  result: VictoryResult;
  gainedXp: number;
}

export interface SecurityLayer {
  screen: SceenName;
  baseXp: number;
}

export interface BreachOption {
  systemName: string;
  securityLayers: SecurityLayer[];
}

export interface Breach extends BreachOption {
  seed: number;
  nextLayerPointer: number;
  securityLayerResults: SecurityLayerResult[];
  corePassword: string;
  vulnPool: VulnerabilitySpec[];
  awardedVulns: VulnerabilitySpec[];
  breachResult?: BreachResult;
  exploitTokens: number;
}

class Game {
  currentScreen: SceenName = "loading";
  currentBreach?: Breach;

  // Level states - defined when level is next/active
  memoryDefragLevel?: MemoryDefragLevel;

  private dictionary?: Dictionary;

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

  getNextLayer() {
    if (!this.currentBreach) return;

    const { securityLayers, nextLayerPointer } = this.currentBreach;

    if (nextLayerPointer < securityLayers.length) {
      return securityLayers[nextLayerPointer];
    }
  }

  getSystemOptions(): BreachOption[] {
    const securityLayers: SecurityLayer[] = [
      {
        screen: "memory-defrag-level",
        baseXp: 1,
      },
      {
        screen: "memory-defrag-level",
        baseXp: 1,
      },
      {
        screen: "memory-defrag-level",
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
    // Generate breach seed
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const seed = arr[0];

    const corePassword = generateCorePassword();
    const vulnPool = getVulnerabilitySpecs(corePassword, seed);
    const awardedVulns = [getExactLengthVulnSpec(corePassword)]; // Always start with length vuln

    // Setup the full breach object using selected option
    this.currentBreach = {
      ...breachOption,
      seed,
      nextLayerPointer: 0,
      securityLayerResults: [],
      corePassword,
      vulnPool,
      awardedVulns,
      exploitTokens: 1,
    };

    this.saveBreach();

    // Change to progress screen
    this.changeScreen("breach-progress");
  }

  startNextLayer() {
    if (!this.currentBreach || !this.dictionary) return;

    const { nextLayerPointer, seed } = this.currentBreach;

    const nextLayer = this.getNextLayer();
    if (!nextLayer) return;

    const nextLayerSeed = splitmix32((seed + nextLayerPointer) >>> 0);

    switch (nextLayer.screen) {
      case "memory-defrag-level":
        this.memoryDefragLevel = new MemoryDefragLevel(
          this.dictionary,
          nextLayerSeed,
          nextLayer.baseXp,
          (stats) => this.concludeLayer(stats),
        );
        this.changeScreen("memory-defrag-level");
        break;
    }
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
      this.awardExploitTokens(breach);
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
    // When testing, return manually created state here
    const testing = false;

    const corePassword = "AK";
    const seed = 1234;
    const vulnPool = getVulnerabilitySpecs(corePassword, seed);
    const awardedVulns: VulnerabilitySpec[] = [];
    const hint = vulnPool.find((vs) => vs.type === "max-span");
    if (hint) awardedVulns.push(hint);

    const testBreach: Breach = {
      systemName: "Test",
      securityLayers: [{ screen: "memory-defrag-level", baseXp: 1 }], // might want a layer generator later
      securityLayerResults: [{ result: "win", gainedXp: 1 }],
      nextLayerPointer: 1,
      seed,
      corePassword,
      vulnPool,
      awardedVulns,
      exploitTokens: 1,
    };

    if (testing) return testBreach;

    // Load saved breach from localStorage
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
    // Remove a v from the pool and add to awarded list
    const rnd = Math.floor(Math.random() * breach.vulnPool.length);
    const removed = breach.vulnPool.splice(rnd, 1);
    breach.awardedVulns.push(removed[0]);
  }

  private awardExploitTokens(breach: Breach) {
    breach.exploitTokens += 2;
  }
}

export const game = new Game();
