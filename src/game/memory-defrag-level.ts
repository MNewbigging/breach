import { eventDispatcher } from "../events/event-dispatcher";
import { Breach } from "./breach";
import { Dictionary } from "./load-dictionary";
import { rngFunctionFromSeed, shuffle } from "./seeded-random";
import { LevelStats } from "./types";

export type MDLetterState = "unused" | "in-use" | "used";

export interface MDLetter {
  id: string;
  char: string;
  state: MDLetterState;
}

export interface MDBankWord {
  lettersUsed: string[]; // ids
  word: string;
}

export class MemoryDefragLevel {
  letterPool: MDLetter[] = [];
  wordBar: MDLetter[] = []; // refs into letter pool
  wordBank: MDBankWord[] = [];

  constructor(
    private breach: Breach,
    private dictionary: Dictionary,
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
    // Get the word from the bar
    const word = this.wordBar
      .map((letter) => letter.char)
      .join("")
      .toLowerCase();
    if (!word) return;

    // Is it in the dictionary
    if (this.dictionary.set.has(word)) {
      // Add to bank
      const bankWord: MDBankWord = {
        lettersUsed: this.wordBar.map((wbLetter) => wbLetter.id),
        word: word.toUpperCase(),
      };
      this.wordBank.push(bankWord);

      // Set letters to used
      this.wordBar.forEach((letter) => (letter.state = "used"));

      // Clear bar
      this.wordBar.length = 0;

      // Is this game over?
      if (this.isGameOver()) {
        const stats: LevelStats = {
          screen: "memory-defrag-level",
          result: "win",
          gainedXp: this.breach.getNextLevel().baseXp, // plus any bonuses
        };
        this.breach.concludeLevel(stats);
      }

      eventDispatcher.fire("memory-defrag-update", null);
    } else {
      // Not ok, update UI somehow
      // Some lose condition?
    }
  }

  onTapPoolLetter(letter: MDLetter) {
    // Add it if unused
    if (letter.state === "unused") this.addLetterToWordBar(letter);
  }

  onTapBarLetter(letter: MDLetter) {
    letter.state = "unused";
    this.wordBar = this.wordBar.filter((wbLetter) => wbLetter.id !== letter.id);
    eventDispatcher.fire("memory-defrag-update", null);
  }

  clearWord(bankWord: MDBankWord) {
    // Free up the used letters
    bankWord.lettersUsed.forEach((id) => {
      const letter = this.letterPool.find((letter) => letter.id === id);
      if (letter) letter.state = "unused";
    });

    this.wordBank = this.wordBank.filter((bw) => bw !== bankWord);
    eventDispatcher.fire("memory-defrag-update", null);
  }

  useWildExploit() {}

  private addLetterToWordBar(letter: MDLetter) {
    letter.state = "in-use";
    this.wordBar.push(letter);
    eventDispatcher.fire("memory-defrag-update", null);
  }

  private onTypeCharacter = (character: string) => {
    // Is there a matching unused letter
    const letter = this.letterPool.find(
      (l) => l.char === character && l.state === "unused",
    );
    if (!letter) return;

    this.addLetterToWordBar(letter);
  };

  private deleteLast() {
    const wbLetter = this.wordBar.pop();
    if (!wbLetter) return;
    wbLetter.state = "unused";
    eventDispatcher.fire("memory-defrag-update", null);
  }

  private deleteAll() {
    this.wordBar.forEach((wbLetter) => {
      wbLetter.state = "unused";
    });

    this.wordBar.length = 0;
    eventDispatcher.fire("memory-defrag-update", null);
  }

  private isGameOver() {
    return this.letterPool.every((letter) => letter.state === "used");
  }

  private setupGame() {
    const rng = rngFunctionFromSeed(this.breach.getNextLevelSeed());
    const wordPool = this.getStartingWordPool(rng);
    console.log(wordPool);
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
      id: crypto.randomUUID(),
      char,
      state: "unused",
    }));
  }
}

function isLetterAZ(letter: string) {
  return /^[A-Z]$/.test(letter);
}
