export function randomSeed(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0];
}

export function rngFunctionFromSeed(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomLetter(rng: () => number): string {
  return String.fromCharCode(65 + Math.floor(rng() * 26));
}

export function randomIndex(rng: () => number, length: number): number {
  return Math.floor(rng() * length);
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice(); // clone so we don't mutate original
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function splitmix32(seed: number): number {
  seed = (seed >>> 0) + 0x9e3779b1;
  let z = seed >>> 0;
  z = Math.imul(z ^ (z >>> 15), z | 1) >>> 0;
  z ^= (z + Math.imul(z ^ (z >>> 7), z | 61)) >>> 0;
  return (z ^ (z >>> 14)) >>> 0;
}
