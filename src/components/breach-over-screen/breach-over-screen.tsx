import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-over-screen.module.scss";

export function BreachOverScreen() {
  const breach = game.currentBreach;
  if (!breach) return null;

  const totalXp = breach.securityLayerStats.reduce(
    (sum, layer) => (sum += layer.gainedXp),
    0,
  );

  return (
    <Screen className={styles["breach-over-screen"]}>
      <AnimatedBlock className={styles["breach-info"]}>
        <span>{`>BREACH OVER<`}</span>
        <span>YOU WON</span>
        <span>{`XP gained: ${totalXp}`}</span>
      </AnimatedBlock>

      <AnimatedBlock>
        <Button text={"Conclude Breach"} onClick={() => game.finishBreach()} />
      </AnimatedBlock>
    </Screen>
  );
}
