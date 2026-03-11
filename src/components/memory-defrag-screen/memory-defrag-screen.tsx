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
        {letterPool.map((mdl, index) => (
          <MDLetterTag key={`pool-letter-${index}`} mdl={mdl} />
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bar"]}>
        <span className={styles["input-prefix"]} aria-hidden="true">
          &gt;
        </span>

        <div className={styles["word-input"]}>
          {wordBar.map((mdl, index) => (
            <MDLetterTag key={`bar-letter-${index}`} mdl={mdl} />
          ))}
        </div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bank"]}></AnimatedBlock>
    </Screen>
  );
}

function MDLetterTag({ mdl }: { mdl: MDLetter }) {
  return (
    <div className={clsx(styles["letter-tag"], styles[mdl.state])}>
      {mdl.char}
    </div>
  );
}
