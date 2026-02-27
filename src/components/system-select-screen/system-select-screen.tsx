import { useState } from "react";
import { game, BreachOption } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./system-select-screen.module.scss";
import clsx from "clsx";

export function SystemSelectScreen() {
  const [selectedSystem, setSelectedSystem] = useState<BreachOption | null>(
    null,
  );

  // Get the target system options to display
  const targetSystemOptions = game.getSystemOptions();

  // Style system option when selected
  const isSelected = (option: BreachOption) => {
    if (!selectedSystem) return false;
    return selectedSystem.systemName === option.systemName;
  };

  function onInitiateBreach() {
    if (selectedSystem) {
      game.initiateBreach(selectedSystem);
    }
  }

  return (
    <Screen className={styles["system-select-screen"]}>
      <AnimatedBlock className={styles["heading-block"]}>
        <>{`>SELECT SYSTEM TO BREACH<`}</>
      </AnimatedBlock>

      <AnimatedBlock className={styles["system-options"]}>
        {targetSystemOptions.map((option) => (
          <div
            key={option.systemName}
            className={clsx(
              styles["system-option"],
              isSelected(option) && styles["selected"],
            )}
            onClick={() => setSelectedSystem(option)}
          >
            <span> {option.systemName}</span>
            <span>Security Layers: {option.securityLayers.length}</span>
            <span>
              XP:{" "}
              {option.securityLayers.reduce(
                (sum, layer) => (sum += layer.baseXp),
                0,
              )}
            </span>
          </div>
        ))}
      </AnimatedBlock>

      <AnimatedBlock>
        <Button
          text="Initiate Breach"
          disabled={!selectedSystem}
          onClick={onInitiateBreach}
        />
      </AnimatedBlock>
    </Screen>
  );
}
