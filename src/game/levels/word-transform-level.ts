import { Breach } from "../breach";
import { Dictionary } from "../load-dictionary";
import { randomIndex, rngFunctionFromSeed, shuffle } from "../seeded-random";
import { Difficulty } from "../types";

interface WordItem {
  word: string;
  nextTransforms: WordItem[];
}

export class WordTransformLevel {
  readonly startWord: string;
  readonly targetWord: string;

  private adjacencyMap: Map<string, string[]>;

  constructor(
    private breach: Breach,
    private dictionary: Dictionary,
    private difficulty: Difficulty,
  ) {
    // todo difficulty affects word length
    const fourLetterWords = [...dictionary.wordsByLength.get(4)!]; // make a copy since it'll be modified

    this.adjacencyMap = this.buildAdjacencyMap(fourLetterWords);

    // todo Difficulty determines number of required transforms
    const steps = 3;
    const chain = this.getWordChain(steps, fourLetterWords)!; // todo work out how to handle if it can't find any

    this.startWord = chain.word.toUpperCase();
    this.targetWord = this.getTargetWord(steps, chain).toUpperCase();
  }

  private buildAdjacencyMap(pool: string[]) {
    const adjacenyMap = new Map<string, string[]>();

    for (const word of pool) {
      // Find all its neighbours
      const neighbours = pool.filter((candidate) =>
        this.isNextTransformOf(word, candidate),
      );
      adjacenyMap.set(word, neighbours);
    }

    return adjacenyMap;
  }

  private isNextTransformOf = (word: string, candidate: string) => {
    let matches = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === candidate[i]) matches++;
    }
    return matches === word.length - 1;
  };

  private getWordChain(transformSteps: number, startingPool: string[]) {
    const rng = rngFunctionFromSeed(this.breach.getNextLevelSeed());
    const shuffledPool = shuffle(startingPool, rng);

    for (const startCandidate of shuffledPool) {
      const used = new Set<string>();
      used.add(startCandidate);
      const rootTree = this.buildSubTree(startCandidate, transformSteps, used);
      if (rootTree) return rootTree;
      // Else try next candidate
    }

    return null; // No possible chain of target length
  }

  private buildSubTree(
    currentWord: string,
    remainingSteps: number,
    used: Set<string>,
  ): WordItem | null {
    // Reached desired depth
    if (remainingSteps === 0) return { word: currentWord, nextTransforms: [] };

    // Filter known transforms of this word by those already used
    const candidates = this.adjacencyMap
      .get(currentWord)!
      .filter((w) => !used.has(w));

    // If there are no more candidates, reached a dead end
    if (candidates.length === 0) return null;

    const rng = rngFunctionFromSeed(this.breach.getNextLevelSeed());
    const shuffledCandidates = shuffle(candidates, rng);

    // Track all routes of target length, not just first
    const successfulChildren: WordItem[] = [];

    for (const childCandidate of shuffledCandidates) {
      used.add(childCandidate);
      const childSubtree = this.buildSubTree(
        childCandidate,
        remainingSteps - 1,
        used,
      );
      used.delete(childCandidate); // remove for next child candidate

      if (childSubtree) successfulChildren.push(childSubtree);
    }

    // No children reached desired depth
    if (successfulChildren.length === 0) return null;

    return { word: currentWord, nextTransforms: successfulChildren };
  }

  private getTargetWord(steps: number, chain: WordItem) {
    const rng = rngFunctionFromSeed(this.breach.getNextLevelSeed());

    function getRandomChild(wordItem: WordItem) {
      return wordItem.nextTransforms[
        randomIndex(rng, wordItem.nextTransforms.length)
      ];
    }

    let wordItem = chain;
    for (let i = 0; i < steps; i++) {
      wordItem = getRandomChild(wordItem);
    }

    return wordItem.word;
  }
}
