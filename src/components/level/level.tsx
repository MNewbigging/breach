import { game, SecurityLayerStats } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./level.module.scss";

// Temporary! Using as placeholder for implementing flow, will replace with specific level comps later
export function Level() {
  function onWin() {
    const stats: SecurityLayerStats = {
      result: "win",
      gainedXp: 1,
    };
    game.concludeLayer(stats);
  }

  function onLose() {
    const stats: SecurityLayerStats = {
      result: "lose",
      gainedXp: 0,
    };
    game.concludeLayer(stats);
  }

  return (
    <Screen className={styles["level"]}>
      <AnimatedBlock>
        <Button text="Abandon Run" onClick={() => game.abandonBreach()} />
      </AnimatedBlock>

      <AnimatedBlock>
        <Button text="Win" onClick={onWin} />
      </AnimatedBlock>

      <AnimatedBlock>
        <Button text="Lose" onClick={onLose} />
      </AnimatedBlock>
    </Screen>
  );
}
