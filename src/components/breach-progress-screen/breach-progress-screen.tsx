import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-progress-screen.module.scss";
import { KeyConstraints } from "./key-constraints/key-constraints";
import { LevelResults } from "./level-results/level-results";
import { ProgressTracker } from "./progress-tracker/progress-tracker";

export function BreachProgressScreen() {
  const breach = game.currentBreach;
  if (!breach) return null;

  // Get the next level name
  const nextLevelName =
    breach.nextLayerPointer < breach.securityLayers.length
      ? breach.securityLayers[breach.nextLayerPointer].name
      : "Breach Core";

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
      <AnimatedBlock>
        <ProgressTracker />
      </AnimatedBlock>

      <AnimatedBlock className={styles["middle"]}>
        <AnimatedBlock className={styles["block"]}>
          <LevelResults />
        </AnimatedBlock>
        <AnimatedBlock className={styles["block"]}>
          <KeyConstraints />
        </AnimatedBlock>
      </AnimatedBlock>

      <AnimatedBlock className={styles["bot"]}>
        <Button text={`Next: ${nextLevelName}`} onClick={onNextLevel} />
      </AnimatedBlock>
    </Screen>
  );
}
