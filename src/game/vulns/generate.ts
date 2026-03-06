import { randomIndex, rngFunctionFromSeed } from "../seeded-random";
import { VulnerabilitySpec } from "./spec";
import {
  vowelCount,
  sumLetters,
  hasDuplicateChars,
  amCount,
  isPalindrome,
} from "./tests";

export function getExactLengthVulnSpec(password: string): VulnerabilitySpec {
  return { type: "exact-length", exactLength: password.length };
}

export function getVulnerabilitySpecs(password: string, seed: number) {
  const specs: VulnerabilitySpec[] = [];

  const rng = rngFunctionFromSeed(seed);

  // Positional Hints

  // Compositional Hints
  specs.push({ type: "vowel-exact", vowelCount: vowelCount(password) });
  const minVowels = minVowelCount(password, rng);
  if (minVowels > 0) specs.push({ type: "vowel-min", minVowels });

  specs.push({
    type: "duplicate-characters",
    hasDuplicates: hasDuplicateChars(password),
  });

  const minAM = atLeastFromAM(password, rng);
  if (minAM > 0) specs.push({ type: "at-least-AM", minAM });

  const mask = getSetMask(password, rng);
  specs.push({ type: "contains-one-of", mask });

  // Relational / Structural Hints
  if (isPalindrome(password)) specs.push({ type: "is-palindrome" });

  // Mathematical Hints
  specs.push({ type: "sum", sum: sumLetters(password) });

  return specs;
}

// ##### Spec generator helpers #####

function biasedMin(exact: number, rng: () => number, floor = 1) {
  if (exact === 0) return 0;
  const r = rng();
  const biased = r * r;
  const raw = Math.floor(biased * (exact + 1)); // 0..exact
  return Math.min(exact, Math.max(floor, raw));
}

function minVowelCount(s: string, rng: () => number) {
  const vowels = vowelCount(s);
  return biasedMin(vowels, rng);
}

function atLeastFromAM(s: string, rng: () => number) {
  const exact = amCount(s);
  return biasedMin(exact, rng);
}

function getSetMask(password: string, rng: () => number) {
  // Pick one random letter from the password
  const chosen = password[randomIndex(rng, password.length)];

  // Make an alphabet array to pick two other random letters from
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .filter((c) => c !== chosen);

  // Pick two distinct letters
  const firstPick = alphabet.splice(randomIndex(rng, alphabet.length), 1)[0];
  const secondPick = alphabet.splice(randomIndex(rng, alphabet.length), 1)[0];

  // Shuffle the set
  const setLetters = shuffle([chosen, firstPick, secondPick], rng);

  // Return the mask
  return maskFromLetters(setLetters);
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice(); // clone so we don't mutate original
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function maskFromLetters(letters: string[]) {
  let mask = 0;
  for (const c of letters) mask |= 1 << (c.charCodeAt(0) - 65);
  return mask;
}
