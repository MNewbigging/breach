import { Breach } from "../breach";
import { rngFunctionFromSeed } from "../seeded-random";
import { compileHint } from "./compile";
import { HintSpec } from "./spec";

export type GuessFeedback = {
  charsCorrect: number;
  positionsCorrect: number;
  exactMatches: boolean[];
  charMatches: boolean[];
};

export function getGuessFeedback(
  guess: string,
  password: string,
): GuessFeedback {
  let charsCorrect = 0;
  let positionsCorrect = 0;

  const pwArr = [...password];
  const guessArr = [...guess];

  const exactMatches = Array(guessArr.length).fill(false);
  const charMatches = Array(guessArr.length).fill(false);

  // First pass — exact matches
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === pwArr[i]) {
      positionsCorrect++;
      exactMatches[i] = true;
      pwArr[i] = null as any; // consume
      guessArr[i] = null as any; // consume
    }
  }

  // Second pass — character matches (wrong position)
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] && pwArr.includes(guessArr[i])) {
      charsCorrect++;
      charMatches[i] = true;

      const index = pwArr.indexOf(guessArr[i]);
      pwArr[index] = null as any; // consume matched char so dupes don't re-match
    }
  }

  return {
    charsCorrect,
    positionsCorrect,
    exactMatches,
    charMatches,
  };
}

function feedbackCode(
  positionsCorrect: number,
  charsCorrect: number,
  maxLength: number,
) {
  return positionsCorrect * (maxLength + 1) + charsCorrect;
}

export function getCoreAccessAttempts(breach: Breach) {
  const pwLength = breach.corePassword.length;
  // Get the total search space; all possible words of the pw length from the dictionary
  const pwCandidates = breach.dictionary.wordsByLength.get(pwLength)!;

  // Get the remaining percentage of those words that pass all the hint checks
  const passRate = getPassRate(pwCandidates, breach.awardedHints);

  // Get the remaining search space size
  const estimatedSearchSize = Math.max(1, pwCandidates.length * passRate);

  // Current uncertainty in bits
  const bitsUntilSolve = Math.log2(estimatedSearchSize);

  // How much uncertainty is removed with a guess
  const bitsPerGuess = estimateBitsPerGuess(breach.seed, pwCandidates);
  const safeBitsPerGuess = Math.max(0.5, bitsPerGuess); // fallback for small sets

  const attempts = 1 + Math.ceil(bitsUntilSolve / safeBitsPerGuess);
  console.log(attempts);
  const minAttempts = 3;
  const maxAttmpets = 12;
  return clamp(attempts, minAttempts, maxAttmpets);
}

function getPassRate(words: string[], hints: HintSpec[]) {
  const tests = hints.map((spec) => compileHint(spec).test);

  let passed = 0;

  for (const word of words) {
    if (tests.every((test) => test(word))) passed++;
  }

  return passed / words.length;
}

function estimateBitsPerGuess(
  seed: number,
  candidates: string[],
  legalGuesses: string[] = candidates, // guesses are just words of pw.length, so all possible words
) {
  const sampleSize = 64;

  const guesses =
    legalGuesses.length > sampleSize
      ? sampleWithoutReplacement(legalGuesses, sampleSize, seed)
      : legalGuesses;

  let total = 0;
  for (const guess of guesses) {
    total += infoGainFromGuess(candidates, guess);
  }
  return total / legalGuesses.length;
}

function sampleWithoutReplacement<T>(items: T[], count: number, seed: number) {
  if (count >= items.length) return items.slice();

  const rng = rngFunctionFromSeed(seed);
  const arr = items.slice();

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count);
}

function infoGainFromGuess(candidates: string[], guess: string) {
  const buckets = new Map<number, number>();
  const maxLength = guess.length;

  for (const candidate of candidates) {
    const feedback = getGuessFeedback(candidate, guess);
    const code = feedbackCode(
      feedback.positionsCorrect,
      feedback.charsCorrect,
      maxLength,
    );
    buckets.set(code, (buckets.get(code) ?? 0) + 1);
  }

  let h = 0;
  const total = candidates.length;

  for (const count of buckets.values()) {
    const p = count / total;
    h -= p * Math.log2(p);
  }

  return h;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
