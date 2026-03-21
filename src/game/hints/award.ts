import { Breach } from "../breach";
import { randomIndex, rngFunctionFromSeed } from "../seeded-random";
import { lettersFromMask } from "./hints";
import { HintSpec, HintType } from "./spec";
import { isVowel } from "./tests";

export function awardHint(breach: Breach) {
  // Pick from the remaining hints in the pool
  const hintPool = breach.hintPool;

  // Pick randomly for now
  const rng = rngFunctionFromSeed(breach.seed);
  const idx = randomIndex(rng, hintPool.length);
  const hintChoice = hintPool.splice(idx, 1)[0];

  // Now remove hints from the pool made redundant by this choice
  removeRedundancies(hintPool, hintChoice);

  breach.awardedHints.push(hintChoice);
}

function removeRedundancies(hints: HintSpec[], awarded: HintSpec) {
  if (!hasRedundancyChecker(awarded.type)) return hints;

  const checker = redundancyCheckers[awarded.type];
  if (!checker) return hints;

  return hints.filter((candidate) => !checker(awarded as never, candidate));
}

type RedundancyCheckerFor<K extends HintType> = (
  awarded: Extract<HintSpec, { type: K }>,
  candidate: HintSpec,
) => boolean;

type RedundancyCheckerMap = Partial<{
  [K in HintType]?: RedundancyCheckerFor<K>;
}>;

const redundancyCheckers = {
  "position-exact": (awarded, candidate) => {
    // Position 1 is A => Position 1 in [A, B, C]
    if (candidate.type === "position-in-set") {
      return awarded.position === candidate.position;
    }
    // Position 1 is A => Position 1 is Vowel
    if (candidate.type === "position-type") {
      return awarded.position === candidate.position;
    }
    // Position 1 is A => There are 1 As
    if (candidate.type === "letter-count") {
      return awarded.letter === candidate.letter && candidate.count === 1;
    }

    return false;
  },
  //
  "position-in-set": (awarded, candidate) => {
    // Position 1 in [A, B, C] => Position 1 is A
    // Does technically offer more info, might remove this if need more strong hints
    if (candidate.type === "position-exact") {
      return awarded.position === candidate.position;
    }
    // Posotion 1 in [A, B, C] => Position 1 is Vowel
    if (
      candidate.type === "position-type" &&
      awarded.position === candidate.position
    ) {
      // If there are only Vowels/Consonants in the set, useless hint
      const letters = lettersFromMask(awarded.mask);
      const areLettersVowels = letters.map((l) => isVowel(l));
      const allSame = areLettersVowels.every((v) => v === areLettersVowels[0]);
      return allSame;
    }

    return false;
  },
  //
  "vowel-exact": (awarded, candidate) => {
    // Exactly 2 vowels => At least 1 vowel
    return candidate.type === "vowel-min";
  },
  //
  "vowel-min": (awarded, candidate) => {
    // At least 1 vowel => Exactly 1 vowel
    if (candidate.type === "vowel-exact") {
      // Allows both hints if numbers differ since exact is still more info
      return candidate.vowelCount === awarded.minVowels;
    }
    return false;
  },
  //
  "duplicate-characters": (awarded, candidate) => {
    // If there are no dupes, distinct counts are redundant.
    // Note - not actually adding these when generating, but this doesn't hurt
    if (!awarded.hasDuplicates) {
      return ["distinct-count", "min-distinct-count"].includes(candidate.type);
    }

    return false;
  },
  //
  "distinct-count": (awarded, candidate) => {
    // There being dupes is obvious (e.g length is 4 and distinct is 2)
    return (
      candidate.type === "min-distinct-count" ||
      candidate.type === "duplicate-characters"
    );
  },
  //
  "min-distinct-count": (awarded, candidate) => {
    // There being dupes is obvious (e.g length is 4 and distinct is 2)
    return (
      candidate.type === "distinct-count" ||
      candidate.type === "duplicate-characters"
    );
  },
  //
} satisfies RedundancyCheckerMap;

type SupportedRedundancyType = keyof typeof redundancyCheckers;

function hasRedundancyChecker(type: HintType): type is SupportedRedundancyType {
  return type in redundancyCheckers;
}
