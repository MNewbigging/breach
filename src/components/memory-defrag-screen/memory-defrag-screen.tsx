import { MemoryDefragLevel } from "../../game/memory-defrag-level";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./memory-defrag-screen.module.scss";

interface MemoryDefragScreenProps {
  levelState: MemoryDefragLevel;
}

export function MemoryDefragScreen({ levelState }: MemoryDefragScreenProps) {
  const { letterPool } = levelState;

  return (
    <Screen className={styles["screen-container"]}>
      <AnimatedBlock className={styles["top-bar"]}></AnimatedBlock>

      <AnimatedBlock className={styles["letter-pool"]}>
        {letterPool.map((mdl, index) => (
          <div key={`md-letter-${index}`} className={styles["letter"]}>
            {mdl.letter}
          </div>
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bar"]}></AnimatedBlock>

      <AnimatedBlock className={styles["word-bank"]}></AnimatedBlock>
    </Screen>
  );
}
