import { Dictionary } from "./load-dictionary";
import { rngFunctionFromSeed, shuffle } from "./seeded-random";

export interface MDLetter {
  letter: string;
}

export class MemoryDefragLevel {
  letterPool: MDLetter[] = [];

  constructor(
    private dictionary: Dictionary,
    private seed: number,
  ) {
    this.setupGame();
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

    return shuffled.map((letter) => ({
      letter,
    }));
  }
}
