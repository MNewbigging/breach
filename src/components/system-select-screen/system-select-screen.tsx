import { useState } from "react";
import { game } from "../../game/game";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./system-select-screen.module.scss";
import clsx from "clsx";
import { Difficulty } from "../../game/types";

export function SystemSelectScreen() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);

  // Get the target system options to display
  const breachOptions = game.getBreachOptions();

  // Style system option when selected
  const isSelected = (option: Difficulty) => {
    if (!selectedDifficulty) return false;
    return selectedDifficulty === option;
  };

  function onInitiateBreach() {
    if (selectedDifficulty) {
      game.initiateBreach(selectedDifficulty);
    }
  }

  return (
    <Screen className={styles["system-select-screen"]}>
      <AnimatedBlock className={styles["heading-block"]}>
        <>{`>SELECT SYSTEM TO BREACH<`}</>
      </AnimatedBlock>

      <AnimatedBlock className={styles["system-options"]}>
        {breachOptions.map(({ difficulty, levelCount }, index) => (
          <div
            key={`breach-${index}-${difficulty}`}
            className={clsx(
              styles["system-option"],
              isSelected(difficulty) && styles["selected"],
            )}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            <span>Difficulty: {difficulty}</span>
            <span>Security Layers: {levelCount}</span>
          </div>
        ))}
      </AnimatedBlock>

      <AnimatedBlock>
        <Button
          text="Initiate Breach"
          disabled={!selectedDifficulty}
          onClick={onInitiateBreach}
        />
      </AnimatedBlock>
    </Screen>
  );
}
