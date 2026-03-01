import { VulnerabilitySpec } from "./spec";

export function getVulnHintFor(spec: VulnerabilitySpec) {
  switch (spec.type) {
    case "exact-length":
      return `Length is ${spec.exactLength}`;
    case "vowel-exact":
      return `Exactly ${spec.vowelCount} vowel${spec.vowelCount === 1 ? "" : "s"}`;
    case "vowel-min":
      return `At least ${spec.minVowels} vowel${spec.minVowels === 1 ? "" : "s"}`;
    case "sum":
      return `Sum is ${spec.sum}`;
    case "duplicate-characters":
      return `${spec.hasDuplicates ? "Has" : "no"} duplicate characters`;
    case "at-least-AM":
      return `At least ${spec.minAM} from A-M`;
    default:
      return assertNever(spec);
  }
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}
