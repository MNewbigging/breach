import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-progress-screen.module.scss";
import { VulnerabilityDisplay } from "./vulnerability-display/vulnerability-display";
import { LevelResults } from "./level-results/level-results";
import { ProgressTracker } from "./progress-tracker/progress-tracker";
import { Breach } from "../../game/breach";

interface BreachProgressScreenProps {
  breach: Breach;
}

export function BreachProgressScreen({ breach }: BreachProgressScreenProps) {
  // Get the next level name
  const nextLevelName = getNextLevelName(breach);

  return (
    <Screen className={styles["breach-progress-screen"]}>
      <AnimatedBlock className={styles["top"]}>
        <Button text="Abandon Run" onClick={() => breach.abandon()} />

        <div className={styles["exploit-area"]}>
          Exploit Tokens: {breach.exploitTokens}
        </div>

        <ProgressTracker
          levels={breach.levels}
          levelStats={breach.levelStats}
        />
      </AnimatedBlock>

      <AnimatedBlock className={styles["middle"]}>
        <AnimatedBlock className={styles["block"]}>
          <LevelResults stats={breach.levelStats} />
        </AnimatedBlock>
        <AnimatedBlock className={styles["block"]}>
          <VulnerabilityDisplay awardedHints={breach.awardedHints} />
        </AnimatedBlock>
      </AnimatedBlock>

      <AnimatedBlock className={styles["bot"]}>
        <Button
          text={`Next: ${nextLevelName}`}
          onClick={() => breach.startNextLevel()}
        />
      </AnimatedBlock>
    </Screen>
  );
}

function getNextLevelName(breach: Breach) {
  const nextLevel = breach.getNextLevel();

  switch (nextLevel.screen) {
    case "memory-defrag-level":
      return "Memory Defrag";
    case "word-transform-level":
      return "Word Transform";
    case "core-access":
      return "Breach Core";
    default:
      return `>PARSING_ERROR<`;
  }
}
