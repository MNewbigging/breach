import { useState } from "react";
import { game, SystemOption } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./system-select-screen.module.scss";
import clsx from "clsx";

export function SystemSelectScreen() {
  const [selectedSystem, setSelectedSystem] = useState<SystemOption | null>(
    null,
  );

  // Get the target system options to display
  const targetSystemOptions = game.getSystemOptions();

  // Style system option when selected
  const isSelected = (systemOption: SystemOption) => {
    if (!selectedSystem) return false;
    return selectedSystem.name === systemOption.name;
  };

  return (
    <Screen className={styles["system-select-screen"]}>
      <AnimatedBlock className={styles["heading-block"]}>
        <>{`>SELECT TARGET SYSTEM<`}</>
      </AnimatedBlock>

      <AnimatedBlock className={styles["system-options"]}>
        {targetSystemOptions.map((systemOption) => (
          <div
            key={systemOption.name}
            className={clsx(
              styles["system-option"],
              isSelected(systemOption) && styles["selected"],
            )}
            onClick={() => setSelectedSystem(systemOption)}
          >
            {systemOption.name}
          </div>
        ))}
      </AnimatedBlock>

      <AnimatedBlock>
        <Button
          text="Next"
          disabled={!selectedSystem}
          onClick={() => console.log("click")}
        />
      </AnimatedBlock>
    </Screen>
  );
}
