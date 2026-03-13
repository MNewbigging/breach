import { useEffect } from "react";
import {
  MDBankWord,
  MDLetter,
  MemoryDefragLevel,
} from "../../game/memory-defrag-level";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./memory-defrag-screen.module.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import clsx from "clsx";
import { Breach } from "../../game/game";

interface MemoryDefragScreenProps {
  levelState: MemoryDefragLevel;
  breach: Breach;
}

export function MemoryDefragScreen({
  levelState,
  breach,
}: MemoryDefragScreenProps) {
  useEventUpdater("memory-defrag-update");
  const { letterPool, wordBar, wordBank } = levelState;

  // React controls listeners
  useEffect(() => {
    window.addEventListener("keydown", levelState.onKeyDown);

    return () => {
      window.removeEventListener("keydown", levelState.onKeyDown);
    };
  });

  return (
    <Screen className={styles["screen-container"]}>
      <AnimatedBlock className={styles["top-bar"]}>
        <div>Exploit Tokens: {breach.exploitTokens}</div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["letter-pool"]}>
        {letterPool.map((letter, index) => (
          <Letter
            key={`pool-letter-${index}`}
            letter={letter}
            className={clsx(styles["pool-letter"], styles[letter.state])}
            onClick={() => levelState.onTapPoolLetter(letter)}
          />
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bar"]}>
        <span className={styles["input-prefix"]} aria-hidden="true">
          &gt;
        </span>

        <div className={styles["word-input"]}>
          {wordBar.map((letter, index) => (
            <Letter
              key={`bar-letter-${index}`}
              letter={letter}
              className={styles["bar-letter"]}
              onClick={() => levelState.onTapBarLetter(letter)}
            />
          ))}
        </div>

        <div
          className={styles["submit-button"]}
          onClick={() => levelState.submit()}
        >
          ⏎
        </div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bank"]}>
        {wordBank.map((bankWord, index) => (
          <WordTag
            key={`bank-word-${index}`}
            bankWord={bankWord}
            onClick={() => levelState.clearWord(bankWord)}
          />
        ))}
      </AnimatedBlock>
    </Screen>
  );
}

interface LetterProps {
  className: string; // different styling for pool/bar
  onClick: () => void;
  letter: MDLetter;
}

function Letter({ className, onClick, letter }: LetterProps) {
  return (
    <div className={className} onClick={onClick}>
      {letter.char}
    </div>
  );
}

function WordTag({
  bankWord,
  onClick,
}: {
  bankWord: MDBankWord;
  onClick: () => void;
}) {
  return (
    <div className={styles["word-tag"]}>
      <div>{bankWord.word}</div>
      <div className={styles["tag-clear"]} onClick={onClick}>
        [x]
      </div>
    </div>
  );
}
