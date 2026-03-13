import { Breach } from "../game";
import { rngFunctionFromSeed } from "../seeded-random";
import { compileHint } from "./compile";
import { HintSpec } from "./spec";

// Accepts rng
function randomUppercaseString(len: number, rng: () => number) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += String.fromCharCode(65 + Math.floor(rng() * 26));
  }
  return out;
}

function totalSearchSpaceSize(length: number) {
  return 26 ** length;
}

function log2(n: number) {
  return Math.log(n) / Math.log(2);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getBreachAttempts(breach: Breach) {
  const pwLength = breach.corePassword.length;

  // This is the exact number of total possible pw candidates before hints
  const maxSize = totalSearchSpaceSize(pwLength);

  // Get a rough number of possible pws that pass hints
  const passPercent = getSampledPassRate(
    pwLength,
    breach.awardedVulns,
    breach.seed,
  );
  const estimatedSearchSize = Math.max(1, maxSize * passPercent); // in case nothing passes

  // Measure 'how many pws it could be' as 'how uncertain is the solution' in bits
  const bitsUntilSolve = log2(estimatedSearchSize);

  // How many bits of certainty each mastermind clue would reveal
  const bitsPerGuess = 3;

  // Get an initial idea of attempts from (un)certainty bits info
  const attempts = 1 + Math.ceil(bitsUntilSolve / bitsPerGuess);

  // Clamp it within sensible bounds and return
  const minAttempts = 3;
  const maxAttempts = 12;
  return clamp(attempts, minAttempts, maxAttempts);
}

function getSampledPassRate(pwLength: number, specs: HintSpec[], seed: number) {
  // Algorithm constraints
  const minDraws = 30_000;
  const maxDraws = 220_000;
  const targetPasses = 600;

  const rng = rngFunctionFromSeed(seed);
  const tests = specs.map((spec) => compileHint(spec).test);
  let draws = 0;
  let passes = 0;

  // If we haven't hit max draws and we haven't drawn enough or passed enough:
  while (draws < maxDraws && (draws < minDraws || passes < targetPasses)) {
    draws++;
    const pw = randomUppercaseString(pwLength, rng);

    // Check all awarded constraints
    let ok = true;
    for (const test of tests) {
      if (!test(pw)) {
        ok = false;
        break;
      }
    }
    if (ok) passes++;
  }

  return passes / draws;
}

/**
 * The idea:
 * - the player has to guess a password of a certain length
 * - we need to work out how many attempts is reasonable to guess the pw
 * - by factoring in the hints they've unlocked which reduce pw search space
 *   as well as the clues given in mastermind feedback
 *
 * The core problem:
 * - due to pw length of 4-6, the number of possible passwords is huge
 * - meaning we can't actually generate all possible passwords and
 *   test against hints to get an accurate picture of how many attempts
 *   would shrink that number to 1 (because it'd take too long)
 * - so we need a sample of the max size that we can actually afford to test against
 *
 * However, sampling has drawbacks too:
 * - if we sampled a fixed number of times, small pass rates can skew the
 *   returned pass percent massively
 *
 * So we flip it from 'maxSampleSize' to 'targetSamplePassRate'
 * - we generate pws and count passes until we get to a targetPass count
 * - then compare that to the total samples it took to get there
 * - this works well so long as the target pass count is high enough (if it were 1,
 *   the total samples might be 2, 5, 10+ which also skews wildly)
 * - as targetPass count increases, the passPercent stabilises because rng averages out
 *
 * But
 * - we still need a max sample size due to performance reasons
 * - we need a min sample size in case we get many passes up front, which would also skew results
 * - we'll likely hit targetPass count before maxSampleSize, gaining performance
 *
 * That's not all:
 * - passPercent * maxSize gives us an approximate number of possible passwords
 * - that's useless info on its own, we want to measure uncertainty not possible answers
 * - mastermind clues reduce search space by half (roughly) with each good guess
 * - so we need to work out how many halvings reduce the search space to 1
 *
 * Halving search space with binary:
 * - 16 -> 8 -> 4 -> 2 -> 1 is 4 halvings or 4 binary decisions
 * - log2(16) = 4
 *
 *   possible pws | bits of uncertainty
 *        1               0
 *        2               1
 *        4               2
 *        8               3
 *        16              4
 *        256             8
 *        456,976         18.8
 *
 * - so we compute bits by doing: bits = log2(passPercent * maxSize)
 * - we're asking "how many halvings would I need to isolate the answer?"
 *
 * However:
 * - mastermind cluess don't give a yes/no answer, which would halve search space
 * - it gives more info than that, meaning more than 1 bit of information
 * - so we model how many bits of info are given with each guess feedback at around 2-4 bits
 *
 *  b = expected bits per guess
 *  B = bits of uncertainty
 *
 *  So if B = 12 and we assume b = 3
 *  Attempts = B / b = 12 / 3 = 4
 *
 *
 */
