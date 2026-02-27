import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./breach-progress-screen.module.scss";
import { ProgressTracker } from "./progress-tracker/progress-tracker";

export function BreachProgressScreen() {
  return (
    <Screen className={styles["breach-progress-screen"]}>
      <AnimatedBlock className={styles["top"]}>
        <ProgressTracker />
      </AnimatedBlock>

      <AnimatedBlock className={styles["middle"]}></AnimatedBlock>

      <AnimatedBlock className={styles["bot"]}></AnimatedBlock>
    </Screen>
  );
}
