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
    case "contains-one-of":
      return `At least 1 in [${lettersFromMask(spec.mask).join(", ")}]`;
    case "is-palindrome":
      return `Is a palindrome`;
    case "position-exact":
      return `Position ${spec.position + 1} is ${spec.letter}`;
    case "vowel-relation":
      return `Vowels ${spec.vowelRelation} consonants`;
    case "position-type":
      return `Position ${spec.position + 1} is ${spec.letterType}`;
    case "position-in-set":
      return `Position ${spec.position + 1} is one of  [${lettersFromMask(spec.mask).join(", ")}]`;
    case "highest-value":
      return `Highest letter value is ${spec.value}`;
    case "lowest-value":
      return `Lowest letter value is ${spec.value}`;
    case "contains-none-of":
      return `Contains none of [${lettersFromMask(spec.mask).join(", ")}]`;
    case "distinct-count":
      return `${spec.count} distinct letters`;
    case "min-distinct-count":
      return `At least ${spec.min} distinct letters`;
    default:
      return assertNever(spec);
  }
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}

function lettersFromMask(mask: number): string[] {
  const letters: string[] = [];

  for (let i = 0; i < 26; i++) {
    if (mask & (1 << i)) {
      letters.push(String.fromCharCode(65 + i));
    }
  }

  return letters;
}
