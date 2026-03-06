import { randomIndex, rngFunctionFromSeed } from "../seeded-random";
import { VulnerabilitySpec } from "./spec";
import {
  vowelCount,
  sumLetters,
  hasDuplicateChars,
  amCount,
  isPalindrome,
  isVowel,
} from "./tests";

export function getExactLengthVulnSpec(password: string): VulnerabilitySpec {
  return { type: "exact-length", exactLength: password.length };
}

export function getVulnerabilitySpecs(password: string, seed: number) {
  const specs: VulnerabilitySpec[] = [];

  const rng = rngFunctionFromSeed(seed);

  // Positional Hints
  {
    const { position, letter } = positionExactValues(password, rng);
    specs.push({ type: "position-exact", position, letter });
  }

  {
    const { position, letterType } = positionTypeValues(password, rng);
    specs.push({ type: "position-type", position, letterType });
  }

  {
    const { position, mask } = positionInSetValues(password, rng);
    specs.push({ type: "position-in-set", position, mask });
  }

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

  specs.push({
    type: "vowel-relation",
    vowelRelation: vowelRelation(password),
  });

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

  const set = getRandomSetFor(chosen, rng);

  // Return the mask
  return maskFromLetters(set);
}

function getRandomSetFor(chosen: string, rng: () => number, setLength = 3) {
  const set = [chosen];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .filter((c) => c !== chosen);

  for (let i = 1; i < setLength; i++) {
    const pick = alphabet.splice(randomIndex(rng, alphabet.length), 1)[0];
    set.push(pick);
  }

  return shuffle(set, rng);
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

function positionExactValues(password: string, rng: () => number) {
  const position = randomIndex(rng, password.length);
  return { position, letter: password[position] };
}

function vowelRelation(password: string) {
  const vowels = vowelCount(password);
  const consonants = password.length - vowels;

  if (vowels > consonants) return ">";
  if (vowels === consonants) return "=";
  if (vowels < consonants) return "<";
  return ">"; // just to satisfy ts
}

function positionTypeValues(password: string, rng: () => number) {
  const position = randomIndex(rng, password.length);
  const isV = isVowel(password[position]);
  const letterType = isV ? "vowel" : "consonant";
  return { position, letterType: letterType as "vowel" | "consonant" };
}

function positionInSetValues(password: string, rng: () => number) {
  const position = randomIndex(rng, password.length);
  const set = getRandomSetFor(password[position], rng);
  return { position, mask: maskFromLetters(set) };
}
