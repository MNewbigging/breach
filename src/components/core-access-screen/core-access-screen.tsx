import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./core-access-screen.module.scss";

export function CoreAccessScreen() {
  // Get hydrated V classes for each awarded slim V in the breach

  // As input field updates, run V checks against input value

  // On submit input, run separate mastermind feedback checks and display

  return (
    <Screen className={styles["core-access-screen"]}>
      <AnimatedBlock className={styles["vuln-checker"]}></AnimatedBlock>

      <AnimatedBlock className={styles["password-input"]}></AnimatedBlock>

      <AnimatedBlock className={styles["password-feedback"]}></AnimatedBlock>

      <AnimatedBlock>
        <Button text={"Win Core"} onClick={() => game.concludeCore("win")} />
      </AnimatedBlock>

      <AnimatedBlock>
        <Button text={"Lose Core"} onClick={() => game.concludeCore("lose")} />
      </AnimatedBlock>
    </Screen>
  );
}
