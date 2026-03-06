import { VulnerabilitySpec } from "./spec";
import {
  vowelCount,
  sumLetters,
  hasDuplicateChars,
  amCount,
  containsOneOf,
  isPalindrome,
  vowelRelation,
  positionTypeMatches,
  highestValueEquals,
} from "./tests";

export interface Vulnerability {
  spec: VulnerabilitySpec;
  test: (candidate: string) => boolean;
}

export function compileVulnerability(spec: VulnerabilitySpec): Vulnerability {
  switch (spec.type) {
    case "exact-length":
      return { spec, test: (s: string) => s.length === spec.exactLength };
    case "vowel-exact":
      return { spec, test: (s: string) => vowelCount(s) === spec.vowelCount };
    case "vowel-min":
      return { spec, test: (s: string) => vowelCount(s) >= spec.minVowels };
    case "sum":
      return { spec, test: (s: string) => sumLetters(s) === spec.sum };
    case "duplicate-characters":
      return {
        spec,
        test: (s: string) => hasDuplicateChars(s) === spec.hasDuplicates,
      };
    case "at-least-AM":
      return { spec, test: (s: string) => amCount(s) >= spec.minAM };
    case "contains-one-of":
      return { spec, test: (s: string) => containsOneOf(s, spec.mask) };
    case "is-palindrome":
      return { spec, test: (s: string) => isPalindrome(s) };
    case "position-exact":
      return {
        spec,
        test: (s: string) => s[spec.position] === spec.letter,
      };
    case "vowel-relation":
      return {
        spec,
        test: (s: string) => vowelRelation(s, spec.vowelRelation),
      };
    case "position-type":
      return {
        spec,
        test: (s: string) =>
          positionTypeMatches(s, spec.position, spec.letterType),
      };
    case "position-in-set":
      return {
        spec,
        test: (s: string) => containsOneOf(s, spec.mask),
      };
    case "highest-value":
      return { spec, test: (s: string) => highestValueEquals(s, spec.value) };
  }
}
