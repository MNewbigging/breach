import { useEffect } from "react";
import {
  MDPoolLetter,
  MemoryDefragLevel,
} from "../../game/memory-defrag-level";
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

  console.log("MDS render", letterPool);

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
          <PoolLetter
            key={`pool-letter-${index}`}
            levelState={levelState}
            letter={letter}
          />
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bar"]}>
        <span className={styles["input-prefix"]} aria-hidden="true">
          &gt;
        </span>

        <div className={styles["word-input"]}>
          {wordBar.map((id, index) => (
            <BarLetter
              key={`bar-letter-${index}`}
              levelState={levelState}
              id={id}
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

interface PoolLetterProps {
  levelState: MemoryDefragLevel;
  letter: MDPoolLetter;
}

function PoolLetter({ levelState, letter }: PoolLetterProps) {
  return (
    <div
      className={clsx(styles["pool-letter"], styles[letter.state])}
      onClick={() => levelState.onTapPoolLetter(letter)}
    >
      {letter.char}
    </div>
  );
}

interface BarLetterProps {
  levelState: MemoryDefragLevel;
  id: string;
}

function BarLetter({ levelState, id }: BarLetterProps) {
  // Get the corresponding letter
  const letter = levelState.letterPool.find((letter) => letter.id === id);
  if (!letter) return null;

  return (
    <div
      className={clsx(styles["bar-letter"])}
      onClick={() => levelState.onTapBarLetter(id)}
    >
      {letter.char}
    </div>
  );
}
