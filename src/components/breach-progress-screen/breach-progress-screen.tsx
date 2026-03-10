import { game, Breach } from "../../game/game";
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
  const nextLevelName = getNextLevelName(breach);

  function onNextLevel() {
    const breach = game.currentBreach;
    if (!breach) return;

    if (breach.nextLayerPointer < breach.securityLayers.length) {
      game.nextLayer();
    } else {
      game.accessCore();
    }
  }

  return (
    <Screen className={styles["breach-progress-screen"]}>
      <AnimatedBlock className={styles["top"]}>
        <ProgressTracker />
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

function getNextLevelName(breach: Breach) {
  // First check if there is a next level
  if (breach.nextLayerPointer < breach.securityLayers.length) {
    const nextLayerType = breach.securityLayers[breach.nextLayerPointer].type;
    switch (nextLayerType) {
      case "memory-defrag":
        return "Memory Defrag";
    }
  }

  // Otherwise it's the core access next
  return "Breach Core";
}
