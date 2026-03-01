import { compileVulnerability } from "./compile";
import { VulnerabilitySpec } from "./spec";

function randomUppercaseString(len: number, rng = Math.random) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += String.fromCharCode(65 + Math.floor(rng() * 26));
  }
  return out;
}

function totalSearchSpaceSize(length: number) {
  return 26 ** length;
}

// Seeded random
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function estimateSearchSpaceSize(
  length: number,
  awardedSpecs: VulnerabilitySpec[],
  seed: number,
  {
    targetPasses = 600, // stability knob
    minDraws = 5000, // avoid noisy early exit
    maxDraws = 200_000, // performance cap
  },
) {
  const rng = mulberry32(seed);

  // Compile once
  const tests = awardedSpecs.map((spec) => compileVulnerability(spec).test);

  let draws = 0;
  let passes = 0;

  while (draws < maxDraws && (draws < minDraws || passes < targetPasses)) {
    draws++; // each loop is a draw
    const randomPwString = randomUppercaseString(length, rng);

    // Check all awarded constraints
    let ok = true;
    for (const test of tests) {
      if (!test(randomPwString)) {
        ok = false;
        break;
      }
    }
    if (ok) passes++;
  }

  const pHat = passes / Math.max(1, draws);
  const searcSpaceSize = pHat * totalSearchSpaceSize(length);

  return {
    searcSpaceSize,
  };
}

export function getAttemptsCount(
  passwordLength: number,
  awardedSpecs: VulnerabilitySpec[],
  seed: number,
) {
  const searcSpaceSize = estimateSearchSpaceSize(
    passwordLength,
    awardedSpecs,
    seed,
    {},
  );

  console.log("searchSpaceSize", searcSpaceSize);
}
