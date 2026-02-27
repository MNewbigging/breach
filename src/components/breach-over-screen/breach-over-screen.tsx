import { BreachResult, game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-over-screen.module.scss";

export function BreachOverScreen() {
  const breach = game.currentBreach;
  if (!breach) return null;

  const resultString = getBreachResultString(breach.breachResult);

  const totalXp = breach.securityLayerStats.reduce(
    (sum, layer) => (sum += layer.gainedXp),
    0,
  );

  return (
    <Screen className={styles["breach-over-screen"]}>
      <AnimatedBlock className={styles["breach-info"]}>
        <span>{`>BREACH OVER<`}</span>
        <span>{resultString}</span>
        <span>{`XP gained: ${totalXp}`}</span>
      </AnimatedBlock>

      <AnimatedBlock>
        <Button text={"Conclude Breach"} onClick={() => game.finishBreach()} />
      </AnimatedBlock>
    </Screen>
  );
}

function getBreachResultString(breachResult?: BreachResult) {
  if (breachResult === "win") return "You breached the system core";
  if (breachResult === "lose") return "You failed to gain core access";
  if (breachResult === "abandoned") return "You abandoned the breach attempt";

  return ">PARSING ERROR<";
}
