import { eventDispatcher } from "../events/event-dispatcher";
import { Dictionary } from "./load-dictionary";
import { rngFunctionFromSeed, shuffle } from "./seeded-random";

export type MDLetterState = "unused" | "in-use" | "used";

export interface MDPoolLetter {
  id: string;
  char: string;
  state: MDLetterState;
}

export class MemoryDefragLevel {
  letterPool: MDPoolLetter[] = [];
  wordBar: string[] = []; // ids of pool letters

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
          this.onTypeCharacter(upper);
        }
        break;
    }
  };

  submit() {
    console.log("Submit");

    // Get the word from the bar
  }

  onTapPoolLetter(letter: MDPoolLetter) {
    // Add it if unused
    if (letter.state === "unused") this.addLetterToWordBar(letter);
  }

  onTapBarLetter(removeId: string) {
    // Remove it from the bar
    const poolLetter = this.letterPool.find((letter) => letter.id === removeId);
    if (!poolLetter) return;

    poolLetter.state = "unused";
    this.wordBar = this.wordBar.filter((id) => id !== removeId);
    eventDispatcher.fire("md-word-bar-updated", null);
  }

  private addLetterToWordBar(letter: MDPoolLetter) {
    letter.state = "in-use";
    this.wordBar.push(letter.id);
    eventDispatcher.fire("md-word-bar-updated", null);
  }

  private onTypeCharacter = (character: string) => {
    console.log(character);

    // Is there a matching unused letter
    const letter = this.letterPool.find(
      (l) => l.char === character && l.state === "unused",
    );
    if (!letter) return;

    this.addLetterToWordBar(letter);
  };

  private deleteLast() {
    const id = this.wordBar.pop();
    if (!id) return;

    const letter = this.letterPool.find((letter) => letter.id === id);
    if (!letter) return;

    letter.state = "unused";
    eventDispatcher.fire("md-word-bar-updated", null);
  }

  private deleteAll() {
    this.wordBar.forEach((id) => {
      const letter = this.letterPool.find((letter) => letter.id === id);
      if (!letter) return;
      letter.state = "unused";
    });

    this.wordBar.length = 0;
    eventDispatcher.fire("md-word-bar-updated", null);
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
  ): MDPoolLetter[] {
    const letters: string[] = [];

    wordPool.forEach((word) =>
      word.split("").forEach((char) => letters.push(char.toUpperCase())),
    );

    const shuffled = shuffle(letters, rng);

    return shuffled.map((char) => ({
      id: crypto.randomUUID(),
      char,
      state: "unused",
    }));
  }
}

function isLetterAZ(letter: string) {
  return /^[A-Z]$/.test(letter);
}
