import { useEffect } from "react";
import { Screen } from "../screen/screen";
import styles from "./loading-screen.module.scss";
import { Logo } from "./logo/logo";
import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";

export function LoadingScreen() {
  // Start loading the game
  useEffect(() => {
    game.load();
  }, []);

  // todo if needed later - after 2 seconds show loading text (if loading would ever take that long)

  return (
    <Screen className={styles["loading-screen"]}>
      <AnimatedBlock className={styles["logo-container"]}>
        <Logo />
      </AnimatedBlock>
    </Screen>
  );
}
