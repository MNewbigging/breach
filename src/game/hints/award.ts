import { Breach } from "../game";
import { randomIndex, rngFunctionFromSeed } from "../seeded-random";
import { getHintSpecs } from "./generate";
import { HintSpec } from "./spec";

export function awardVulnerability(breach: Breach) {
  const { seed, vulnPool } = breach;

  // Picking randomly for now
  const rng = rngFunctionFromSeed(seed);
  const rnd = randomIndex(rng, vulnPool.length);

  // Remove from pool and add to awarded
  const removed = breach.vulnPool.splice(rnd, 1);
  breach.awardedVulns.push(removed[0]);

  // Ensure any redundant hints are removed from the pool too
}

function removeRedundantHints(awarded: HintSpec, pool: HintSpec[]) {
  let trimmed = [...pool];

  switch (awarded.type) {
    case "position-exact":
      {
      }
      break;
  }
}

function award(
  awarded: HintSpec[],
  password: string,
  seed: number,
  levelDifficulty = "easy",
) {
  // Get all specs
  const allSpecs = getHintSpecs(password, seed);

  // Get rid of already-awarded and redundant hints based on awarded

  // Get a candidate pool based on difficulty and desired hint strength

  // Pick one using random seeded rng function
}

function trimPoolByAwarded(pool: HintSpec[], awarded: HintSpec[]) {
  // Store type keywords to filter out by
  const blacklist: string[] = [];

  awarded.forEach((spec) => {
    // Positional
    if (spec.type.includes("position")) blacklist.push("position");

    // Vowels
    if (spec.type.includes("vowel")) blacklist.push("vowel");

    // Distinct
    if (spec.type.includes("distinct")) blacklist.push("distinct");
  });

  return pool.filter((s) => !blacklist.some((bl) => s.type.includes(bl)));
}

function classifySpec(spec: HintSpec): "weak" | "medium" | "strong" {
  switch (spec.type) {
    case "exact-length":
    case "contains-none-of":
    case "position-exact":
    case "is-palindrome":
    case "sum":
      return "strong";

    case "at-least-AM":
    case "distinct-count":
    case "duplicate-characters":
    case "vowel-exact":
    case "contains-one-of":
    case "position-in-set":
    case "max-span":
    case "highest-position":
    case "lowest-position":
    case "highest-value":
    case "lowest-value":
      return "medium";

    case "even-relation":
    case "position-type":
    case "first-last-relation":
    case "min-distinct-count":
    case "vowel-min":
    case "even-letter-count":
    case "vowel-relation":
      return "weak";

    case "letter-count":
      return spec.count >= 2 ? "strong" : "medium";

    default:
      return "medium";
  }
}

type HintFamily =
  | "positional"
  | "compositional"
  | "relational"
  | "mathematical"
  | "structural";

function getHintFamily(spec: HintSpec): HintFamily {
  switch (spec.type) {
    // Positional
    case "position-exact":
    case "position-in-set":
    case "highest-position":
    case "lowest-position":
    case "position-type":
      return "positional";

    // Compositional
    case "exact-length":
    case "vowel-exact":
    case "vowel-min":
    case "at-least-AM":
    case "distinct-count":
    case "min-distinct-count":
    case "letter-count":
    case "contains-one-of":
    case "contains-none-of":
      return "compositional";

    // Relational / Pattern
    case "vowel-relation":
    case "first-last-relation":
    case "even-relation":
      return "relational";

    // Structural (semantic: strong shape constraints)
    case "is-palindrome":
    case "duplicate-characters":
      return "structural";

    // Mathematical
    case "sum":
    case "highest-value":
    case "lowest-value":
    case "max-span":
    case "even-letter-count":
      return "mathematical";

    default:
      // fallback: treat unknowns as compositional
      return "compositional";
  }
}

function familyLimit(f: HintFamily): number {
  switch (f) {
    case "positional":
      return 2;
    case "compositional":
      return 3;
    case "relational":
      return 2;
    case "mathematical":
      return 1;
    case "structural":
      return 1;
    default:
      return 2;
  }
}
