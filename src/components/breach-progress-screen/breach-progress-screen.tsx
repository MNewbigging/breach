import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-progress-screen.module.scss";
import { VulnerabilityDisplay } from "./vulnerability-display/vulnerability-display";
import { LevelResults } from "./level-results/level-results";
import { ProgressTracker } from "./progress-tracker/progress-tracker";

export function BreachProgressScreen() {
  const breach = game.currentBreach;
  if (!breach) return null;

  // Get the next level name
  const nextLevelName = getNextLevelName();

  function onNextLevel() {
    const breach = game.currentBreach;
    if (!breach) return;

    if (breach.nextLayerPointer < breach.securityLayers.length) {
      game.startNextLayer();
    } else {
      game.accessCore();
    }
  }

  return (
    <Screen className={styles["breach-progress-screen"]}>
      <AnimatedBlock className={styles["top"]}>
        <ProgressTracker />
        <div className={styles["exploit-area"]}>
          Exploit Tokens: {breach.exploitTokens}
        </div>
        <Button text="Abandon Run" onClick={() => game.abandonBreach()} />
      </AnimatedBlock>

      <AnimatedBlock className={styles["middle"]}>
        <AnimatedBlock className={styles["block"]}>
          <LevelResults />
        </AnimatedBlock>
        <AnimatedBlock className={styles["block"]}>
          <VulnerabilityDisplay />
        </AnimatedBlock>
      </AnimatedBlock>

      <AnimatedBlock className={styles["bot"]}>
        <Button text={`Next: ${nextLevelName}`} onClick={onNextLevel} />
      </AnimatedBlock>
    </Screen>
  );
}

function getNextLevelName() {
  // First check if there is a next level
  const nextLayer = game.getNextLayer();
  if (!nextLayer) return "Breach Core";

  switch (nextLayer.screen) {
    case "memory-defrag-level":
      return "Memory Defrag";
    default:
      return nextLayer.screen;
  }
}
