export function isVowel(c: string): boolean {
  const code = c.charCodeAt(0);
  return (
    code === 65 || // A
    code === 69 || // E
    code === 73 || // I
    code === 79 || // O
    code === 85 // U
  );
}

export function vowelCount(s: string): number {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (isVowel(s[i])) count++;
  }
  return count;
}

export function hasDuplicateChars(s: string): boolean {
  let seen = 0; // bitset for A-Z
  for (let i = 0; i < s.length; i++) {
    const bit = 1 << (s.charCodeAt(i) - 65); // A -> O
    if (seen & bit) return true; // already seen
    seen |= bit;
  }
  return false;
}

export function sumLetters(s: string): number {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i) - 64; // A=1..Z=26
  }
  return sum;
}

export function amCount(s: string): number {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i); // 65..90
    if (code <= 77) count++; // M = 77
  }
  return count;
}
