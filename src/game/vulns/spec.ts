export type Relation = ">" | "=" | "<";
export type LetterType = "vowel" | "consonant";

export type VulnerabilitySpec =
  | { type: "exact-length"; exactLength: number }
  | { type: "vowel-exact"; vowelCount: number }
  | { type: "vowel-min"; minVowels: number }
  | { type: "sum"; sum: number }
  | { type: "at-least-AM"; minAM: number }
  | { type: "duplicate-characters"; hasDuplicates: boolean }
  | { type: "contains-one-of"; mask: number }
  | { type: "is-palindrome" }
  | { type: "position-exact"; position: number; letter: string }
  | { type: "vowel-relation"; vowelRelation: Relation }
  | {
      type: "position-type";
      position: number;
      letterType: LetterType;
    }
  | { type: "position-in-set"; position: number; mask: number }
  | { type: "highest-value"; value: number }
  | { type: "lowest-value"; value: number }
  | { type: "contains-none-of"; mask: number }
  | { type: "distinct-count"; count: number }
  | { type: "min-distinct-count"; min: number }
  | { type: "first-last-relation"; relation: Relation };
