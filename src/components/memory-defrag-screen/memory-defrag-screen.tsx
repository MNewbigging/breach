import { useEffect } from "react";
import { MDLetter, MemoryDefragLevel } from "../../game/memory-defrag-level";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./memory-defrag-screen.module.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import clsx from "clsx";

interface MemoryDefragScreenProps {
  levelState: MemoryDefragLevel;
}

export function MemoryDefragScreen({ levelState }: MemoryDefragScreenProps) {
  useEventUpdater("md-word-bar-updated");
  const { letterPool, wordBar } = levelState;

  // React controls listeners
  useEffect(() => {
    window.addEventListener("keydown", levelState.onKeyDown);

    return () => {
      window.removeEventListener("keydown", levelState.onKeyDown);
    };
  });

  return (
    <Screen className={styles["screen-container"]}>
      <AnimatedBlock className={styles["top-bar"]}></AnimatedBlock>

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

      <AnimatedBlock className={styles["word-bank"]}></AnimatedBlock>
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
