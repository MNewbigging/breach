import { eventDispatcher } from "../../events/event-dispatcher";
import { Breach } from "../breach";
import { Dictionary } from "../load-dictionary";
import { randomIndex, rngFunctionFromSeed, shuffle } from "../seeded-random";
import { Difficulty, LevelStats } from "../types";

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

  readonly wildExploitCost = 1;
  readonly purgeExploitCost = 1;

  private difficulty: Difficulty;

  constructor(
    private breach: Breach,
    private dictionary: Dictionary,
  ) {
    this.difficulty = breach.getNextLevelDifficulty();
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
      .toLowerCase(); // all dictionary words are lower case, but UI is upper
    if (!word) return;

    // Don't allow dupes
    if (this.inWordBank(word)) return;

    // Is it in the dictionary
    if (!this.inDictionary(word)) {
      // Not ok, update UI somehow
      // Some lose condition?
      return;
    }

    // Add to bank
    const bankWord: MDBankWord = {
      lettersUsed: this.wordBar.map((wbLetter) => wbLetter.id),
      word: word.toUpperCase(),
    };
    this.wordBank.push(bankWord);

    // It was in the dictionary, set letters to used & clear bar
    this.wordBar.forEach((letter) => (letter.state = "used"));
    this.wordBar.length = 0;

    // Is this game over?
    if (this.isGameOver()) this.endGame();

    eventDispatcher.fire("memory-defrag-update");
  }

  onTapPoolLetter(letter: MDLetter) {
    // Add it if unused
    if (letter.state === "unused") this.addLetterToWordBar(letter);
  }

  onTapBarLetter(letter: MDLetter) {
    letter.state = "unused";
    this.wordBar = this.wordBar.filter((wbLetter) => wbLetter.id !== letter.id);
    eventDispatcher.fire("memory-defrag-update");
  }

  clearWord(bankWord: MDBankWord) {
    // Free up the used letters
    bankWord.lettersUsed.forEach((id) => {
      const letter = this.letterPool.find((letter) => letter.id === id);
      if (letter) letter.state = "unused";
    });

    this.wordBank = this.wordBank.filter((bw) => bw !== bankWord);
    eventDispatcher.fire("memory-defrag-update");
  }

  useWildExploit() {
    if (!this.breach.canAffordExploit(this.wildExploitCost)) return; // can't afford it!

    this.breach.spendTokens(this.wildExploitCost);

    // Add the wild letter
    this.letterPool.push({
      id: `wild-${crypto.randomUUID()}`,
      char: "*",
      state: "unused",
    });

    eventDispatcher.fire("memory-defrag-update");
  }

  usePurgeExploit(letter: MDLetter) {
    this.breach.spendTokens(this.purgeExploitCost);

    // Remove letter entirely
    this.letterPool = this.letterPool.filter((l) => l.id !== letter.id);

    // Check if this ended the game
    if (this.isGameOver()) this.endGame();

    eventDispatcher.fire("memory-defrag-update");
  }

  private addLetterToWordBar(letter: MDLetter) {
    letter.state = "in-use";
    this.wordBar.push(letter);
    eventDispatcher.fire("memory-defrag-update");
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
    eventDispatcher.fire("memory-defrag-update");
  }

  private deleteAll() {
    this.wordBar.forEach((wbLetter) => {
      wbLetter.state = "unused";
    });

    this.wordBar.length = 0;
    eventDispatcher.fire("memory-defrag-update");
  }

  private inWordBank(word: string) {
    return this.wordBank.some(
      (wb) => wb.word.toLowerCase() === word.toLowerCase(),
    );
  }

  private inDictionary(candidate: string) {
    // If there is no asterisk, can perform a simple search
    if (!candidate.includes("*")) return this.dictionary.set.has(candidate);

    // Predicate search function that accepts * as a wild letter
    const matchesWithWild = (s: string, word: string) => {
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === "*") continue; // allowed
        if (c !== word[i]) return false; // not a match
      }
      return true;
    };

    // Narrow search space to same-length dictionary words
    const bucket = this.dictionary.wordsByLength.get(candidate.length);
    if (!bucket) return false;

    return bucket.some((word) => matchesWithWild(candidate, word));
  }

  private isGameOver() {
    return this.letterPool.every((letter) => letter.state === "used");
  }

  private endGame() {
    const stats: LevelStats = {
      screen: "memory-defrag-level",
      result: "win",
      gainedXp: this.breach.getNextLevel().baseXp, // plus any bonuses
    };
    this.breach.concludeLevel(stats);
  }

  private setupGame() {
    const rng = rngFunctionFromSeed(this.breach.getNextLevelSeed());
    const wordPool = this.getStartingWordPool(rng);
    console.log(wordPool);
    this.letterPool = this.getStartingLetterPool(wordPool, rng);
  }

  private getStartingWordPool(rng: () => number) {
    // Get the word-gen config for this difficulty
    const config = getWordGenConfig(this.difficulty);
    console.log("config", config);
    const wordPool: string[] = [];

    for (const [length, count] of config) {
      const words = this.dictionary.wordsByLength.get(length)!;
      for (let i = 0; i < count; i++) {
        const word = words[randomIndex(rng, words.length)];
        wordPool.push(word);
      }
    }

    // Start simple - pick 3 seeded-random 4-letter words
    // const fourLetterWords = this.dictionary.wordsByLength.get(4) ?? [];
    // const shuffled = shuffle([...fourLetterWords], rng);

    // const wordPool: string[] = [];

    // for (let i = 0; i < 3; i++) {
    //   const word = shuffled.pop();
    //   if (word) wordPool.push(word);
    // }

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
  return /^[A-Z*]$/.test(letter);
}

function getWordGenConfig(difficulty: Difficulty) {
  const config = new Map<number, number>(); // length of word, count

  if (difficulty === "easy") {
    // 19 letters
    config.set(3, 2);
    config.set(4, 2);
    config.set(5, 1);
  } else if (difficulty === "medium") {
    // 22
    config.set(4, 1);
    config.set(5, 1);
    config.set(6, 1);
    config.set(7, 1);
  } else {
    // 24
    config.set(3, 1);
    config.set(4, 1);
    config.set(8, 1);
    config.set(9, 1);
  }

  return config;
}
