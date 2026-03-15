import { useRef } from "react";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./word-transform-screen.module.scss";
import { WordTransformLevel } from "../../game/levels/word-transform-level";
import { Breach } from "../../game/breach";
import { Dictionary } from "../../game/load-dictionary";

interface WordTransformScreenProps {
  breach: Breach;
  dictionary: Dictionary;
}

export function WordTransformScreen({
  breach,
  dictionary,
}: WordTransformScreenProps) {
  const levelStateRef = useRef<WordTransformLevel | null>(null);
  if (!levelStateRef.current) {
    levelStateRef.current = new WordTransformLevel(breach, dictionary, "easy");
  }
  const { startWord, targetWord } = levelStateRef.current;

  return (
    <Screen className={styles["screen-container"]}>
      <AnimatedBlock className={styles["top-bar"]}>
        {`>WORD TRANSFORM<`}
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-area"]}>
        <div>Start: {startWord}</div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["target-area"]}>
        Target: {targetWord}
      </AnimatedBlock>
    </Screen>
  );
}
