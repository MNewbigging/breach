import { VulnerabilitySpec } from "./spec";
import { vowelCount, sumLetters, hasDuplicateChars, amCount } from "./tests";

export function getExactLengthVulnSpec(password: string): VulnerabilitySpec {
  return { type: "exact-length", exactLength: password.length };
}

export function getVulnerabilitySpecs(password: string) {
  const specs: VulnerabilitySpec[] = [];

  // Vowels - exact is strong
  specs.push({ type: "vowel-exact", vowelCount: vowelCount(password) });
  const minVowels = minVowelCount(password);
  if (minVowels > 0) specs.push({ type: "vowel-min", minVowels });

  // Sum
  specs.push({ type: "sum", sum: sumLetters(password) });

  // Dupes - strong
  specs.push({
    type: "duplicate-characters",
    hasDuplicates: hasDuplicateChars(password),
  });

  // Distribution
  const minAM = atLeastFromAM(password);
  if (minAM > 0) {
    specs.push({ type: "at-least-AM", minAM });
  }

  return specs;
}

// ##### Spec generator helpers #####

function biasedMin(exact: number, floor = 1) {
  if (exact === 0) return 0;
  const r = Math.random();
  const biased = r * r;
  const raw = Math.floor(biased * (exact + 1)); // 0..exact
  return Math.min(exact, Math.max(floor, raw));
}

function minVowelCount(s: string) {
  const vowels = vowelCount(s);
  return biasedMin(vowels);
}

function atLeastFromAM(s: string) {
  const exact = amCount(s);
  return biasedMin(exact);
}
