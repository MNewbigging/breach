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

export function vowelRelation(s: string, relation: ">" | "=" | "<") {
  const vowels = vowelCount(s);
  const consonants = s.length - vowels;
  switch (relation) {
    case ">":
      return vowels > consonants;
    case "=":
      return vowels === consonants;
    case "<":
      return vowels < consonants;
  }
}

export function hasDuplicateChars(s: string): boolean {
  let seen = 0; // bitset for A-Z
  for (let i = 0; i < s.length; i++) {
    const bit = 1 << (s.charCodeAt(i) - 65); // A -> 0
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

export function containsOneOf(s: string, mask: number): boolean {
  for (let i = 0; i < s.length; i++) {
    const bit = 1 << (s.charCodeAt(i) - 65);
    if (mask & bit) return true;
  }
  return false;
}

export function isPalindrome(s: string): boolean {
  if (s.length === 0) return false;

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}

export function positionTypeMatches(
  s: string,
  position: number,
  type: "vowel" | "consonant",
): boolean {
  if (s.length - 1 < position) return false;

  const c = s[position];
  if (type === "vowel") return isVowel(c);
  return isVowel(c) === false;
}

export function highestValueEquals(s: string, testValue: number): boolean {
  let highest = 0;
  for (let i = 0; i < s.length; i++) {
    const value = s[i].charCodeAt(0) - 64;
    if (value > testValue) return false;
    if (value > highest) highest = value;
  }
  return highest === testValue;
}

export function lowestValueEquals(s: string, testValue: number): boolean {
  let lowest = 27;
  for (let i = 0; i < s.length; i++) {
    const value = s[i].charCodeAt(0) - 64;
    if (value < testValue) return false;
    if (value < lowest) lowest = value;
  }
  return lowest === testValue;
}
