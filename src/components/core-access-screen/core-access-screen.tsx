import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./core-access-screen.module.scss";

export function CoreAccessScreen() {
  return (
    <Screen className={styles["core-access-screen"]}>
      <AnimatedBlock>
        <Button text={"Win Core"} onClick={() => game.winCore()} />
      </AnimatedBlock>
    </Screen>
  );
}
