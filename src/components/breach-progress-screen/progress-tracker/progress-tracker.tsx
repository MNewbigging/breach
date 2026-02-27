import { ReactElement } from "react";
import { game } from "../../../game/game";
import styles from "./progress-tracker.module.scss";
import clsx from "clsx";

export function ProgressTracker() {
  if (!game.currentBreach) return null;
  const layers = game.currentBreach.securityLayers;
  const nextLayerPointer = game.currentBreach.nextLayerPointer;

  // Work out which circle style to use for each layer
  const circles: ReactElement[] = [];
  for (let i = 0; i < layers.length; i++) {
    // If the pointer is ahead, this layer is completed
    circles.push(
      nextLayerPointer > i ? (
        <div
          key={`circle-${i}`}
          className={clsx(styles["circle"], styles["filled"])}
        ></div>
      ) : (
        <div key={`circle-${i}`} className={styles["circle"]}></div>
      ),
    );
  }

  return (
    <div className={styles["progress-tracker"]}>BREACH PROGRESS {circles}</div>
  );
}
