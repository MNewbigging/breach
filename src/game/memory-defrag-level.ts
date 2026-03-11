import { eventDispatcher } from "../events/event-dispatcher";
import { Dictionary } from "./load-dictionary";
import { rngFunctionFromSeed, shuffle } from "./seeded-random";

export type MDLetterState = "unused" | "in-use" | "used";

export interface MDLetter {
  char: string;
  state: MDLetterState;
}

export class MemoryDefragLevel {
  letterPool: MDLetter[] = [];
  wordBar: MDLetter[] = []; // refs to pool letters

  constructor(
    private dictionary: Dictionary,
    private seed: number,
  ) {
    this.setupGame();
  }

  onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Backspace":
      case "Delete":
        if (e.ctrlKey) {
          this.deleteAll();
        } else {
          this.deleteLast();
        }
        break;
      case "Enter":
        this.submit();
        break;
      default:
        // Ensure it was a character from A..Z
        const upper = e.key.toUpperCase();
        if (isLetterAZ(upper)) {
          this.onCharacter(upper);
        }
        break;
    }
  };

  submit() {
    console.log("Submit");
  }

  onCharacter = (character: string) => {
    console.log(character);

    // Is there a matching unused letter
    const letter = this.letterPool.find(
      (l) => l.char === character && l.state === "unused",
    );
    if (!letter) return;

    // Use it and add it to the word bar array
    letter.state = "in-use";
    this.wordBar.push(letter);

    // Update UI
    eventDispatcher.fire("md-word-bar-updated", null);
  };

  private deleteLast() {
    console.log("delete last");
  }

  private deleteAll() {
    console.log("delete all");
  }

  private setupGame() {
    const rng = rngFunctionFromSeed(this.seed);
    const wordPool = this.getStartingWordPool(rng);
    this.letterPool = this.getStartingLetterPool(wordPool, rng);
  }

  private getStartingWordPool(rng: () => number) {
    // Start simple - pick 3 seeded-random 4-letter words
    const fourLetterWords = this.dictionary.wordsByLength.get(4) ?? [];
    const shuffled = shuffle([...fourLetterWords], rng);

    const wordPool: string[] = [];

    for (let i = 0; i < 3; i++) {
      const word = shuffled.pop();
      if (word) wordPool.push(word);
    }

    return wordPool;
  }

  private getStartingLetterPool(
    wordPool: string[],
    rng: () => number,
  ): MDLetter[] {
    const letters: string[] = [];

    wordPool.forEach((word) =>
      word.split("").forEach((char) => letters.push(char.toUpperCase())),
    );

    const shuffled = shuffle(letters, rng);

    return shuffled.map((char) => ({
      char,
      state: "unused",
    }));
  }
}

function isLetterAZ(letter: string) {
  return /^[A-Z]$/.test(letter);
}
