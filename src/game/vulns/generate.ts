import { randomIndex, rngFunctionFromSeed } from "../seeded-random";
import { LetterType, Relation, VulnerabilitySpec } from "./spec";
import {
  vowelCount,
  sumLetters,
  hasDuplicateChars,
  amCount,
  isPalindrome,
  isVowel,
  distinctCount,
  firstLastRelation,
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

  specs.push({ type: "distinct-count", count: distinctCount(password) });
  const minDistinct = minDistinctCount(password, rng);
  if (minDistinct > 1) {
    specs.push({
      type: "min-distinct-count",
      min: minDistinctCount(password, rng),
    });
  }

  const minAM = atLeastFromAM(password, rng);
  if (minAM > 0) specs.push({ type: "at-least-AM", minAM });

  specs.push({ type: "contains-one-of", mask: getOneOfSetMask(password, rng) });
  specs.push({
    type: "contains-none-of",
    mask: getNoneOfSetMask(password, rng),
  });

  specs.push({
    type: "vowel-relation",
    vowelRelation: vowelRelation(password),
  });

  // Relational / Structural Hints
  if (isPalindrome(password)) specs.push({ type: "is-palindrome" });
  specs.push({
    type: "first-last-relation",
    relation: firstLastRelation(password),
  });

  // Mathematical Hints
  specs.push({ type: "sum", sum: sumLetters(password) });
  specs.push({ type: "highest-value", value: highestLetterValue(password) });
  specs.push({ type: "lowest-value", value: lowestLetterValue(password) });

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

function minDistinctCount(s: string, rng: () => number) {
  const distinct = distinctCount(s);
  return biasedMin(distinct, rng);
}

function atLeastFromAM(s: string, rng: () => number) {
  const exact = amCount(s);
  return biasedMin(exact, rng);
}

function getOneOfSetMask(password: string, rng: () => number) {
  const chosen = password[randomIndex(rng, password.length)];
  const set = getRandomSetFor(chosen, rng);
  return maskFromLetters(set);
}

function getNoneOfSetMask(password: string, rng: () => number, setLength = 3) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .filter((c) => !password.includes(c));

  const set = [];
  for (let i = 0; i < setLength; i++) {
    const pick = alphabet.splice(randomIndex(rng, alphabet.length), 1)[0];
    set.push(pick);
  }

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

function vowelRelation(password: string): Relation {
  const vowels = vowelCount(password);
  const consonants = password.length - vowels;

  if (vowels > consonants) return ">";
  if (vowels === consonants) return "=";
  return "<";
}

function positionTypeValues(password: string, rng: () => number) {
  const position = randomIndex(rng, password.length);
  const isV = isVowel(password[position]);
  const letterType: LetterType = isV ? "vowel" : "consonant";
  return { position, letterType };
}

function positionInSetValues(password: string, rng: () => number) {
  const position = randomIndex(rng, password.length);
  const set = getRandomSetFor(password[position], rng);
  return { position, mask: maskFromLetters(set) };
}

function highestLetterValue(password: string) {
  let highest = 0;
  for (let i = 0; i < password.length; i++) {
    const value = password[i].charCodeAt(0) - 64; // 1..26
    if (value > highest) highest = value;
  }
  return highest;
}

function lowestLetterValue(password: string) {
  let lowest = 27;
  for (let i = 0; i < password.length; i++) {
    const value = password[i].charCodeAt(0) - 64;
    if (value < lowest) lowest = value;
  }
  return lowest;
}
