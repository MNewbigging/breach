// todo add id (via { id: string} & syntax)
export type VulnerabilitySpec =
  | { type: "exact-length"; exactLength: number }
  | { type: "vowel-exact"; vowelCount: number }
  | { type: "vowel-min"; minVowels: number }
  | { type: "sum"; sum: number }
  | { type: "at-least-AM"; minAM: number }
  | { type: "duplicate-characters"; hasDuplicates: boolean }
  | { type: "contains-one-of"; mask: number };
