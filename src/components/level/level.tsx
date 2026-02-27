import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./level.module.scss";

// Temporary! Using as placeholder for implementing flow, will replace with specific level comps later
export function Level() {
  return (
    <Screen className={styles["level"]}>
      <AnimatedBlock>
        <Button text="Win" onClick={() => game.winLayer()} />
      </AnimatedBlock>
    </Screen>
  );
}
