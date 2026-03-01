export function randomSeed() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0];
}

export function rngFunctionFromSeed(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
