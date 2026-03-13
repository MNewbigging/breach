export type Relation = ">" | "=" | "<";
export type LetterType = "vowel" | "consonant";
export type HintTier = "weak" | "medium" | "strong";

export type HintSpec =
  // Positional
  | { type: "position-exact"; position: number; letter: string } // is this too strong? sort of boring
  | { type: "position-in-set"; position: number; mask: number }
  | { type: "highest-position"; position: number }
  | { type: "lowest-position"; position: number }
  | {
      type: "position-type";
      position: number;
      letterType: LetterType;
    }

  // Compositional
  | { type: "exact-length"; exactLength: number }
  | { type: "vowel-exact"; vowelCount: number }
  | { type: "vowel-min"; minVowels: number }
  | { type: "at-least-AM"; minAM: number }
  | { type: "duplicate-characters"; hasDuplicates: boolean }
  | { type: "distinct-count"; count: number }
  | { type: "min-distinct-count"; min: number }
  | { type: "letter-count"; letter: string; count: number }
  | { type: "contains-one-of"; mask: number }
  | { type: "contains-none-of"; mask: number }

  // Relational
  | { type: "vowel-relation"; vowelRelation: Relation }
  | { type: "first-last-relation"; relation: Relation }
  | { type: "is-palindrome" } // strong
  | { type: "even-relation"; relation: Relation }

  // Mathematical
  | { type: "sum"; sum: number } // strong
  | { type: "highest-value"; value: number }
  | { type: "lowest-value"; value: number }
  | { type: "max-span"; maxSpan: number }
  | { type: "even-letter-count"; count: number };

/**
 * Mutually exclusive hints list:
 *
 * position-exact
 * position-in-set
 * position-type
 * -- when the position is the same (which it would be due to seeded randomIndex)
 *
 * highest-position
 * lowest-position
 * -- if password is all one letter, these positions would be the same
 *
 * vowel-exact
 * vowel-min
 * -- exactly 2 and at least 1 is useless together
 */
