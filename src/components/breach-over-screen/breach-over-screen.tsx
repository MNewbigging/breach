import { Breach, BreachResult, game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-over-screen.module.scss";

export function BreachOverScreen() {
  const breach = game.currentBreach;
  if (!breach) return null;

  const resultString = getBreachResultString(breach);

  const totalXp = breach.securityLayerResults.reduce(
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

function getBreachResultString(breach: Breach) {
  const { breachResult } = breach;

  if (breachResult === "win")
    return `You breached the ${breach.systemName} system core`;
  if (breachResult === "lose")
    return `You failed to breach the ${breach.systemName} system core`;
  if (breachResult === "abandoned")
    return `You abandoned the breach attempt. ${breach.systemName} thanks you`;

  return ">PARSING ERROR<";
}
