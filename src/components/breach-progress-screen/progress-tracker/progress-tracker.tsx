import { ReactElement } from "react";
import styles from "./progress-tracker.module.scss";
import clsx from "clsx";
import { Level, LevelStats, VictoryResult } from "../../../game/types";

interface ProgressTrackerProps {
  levels: Level[];
  levelStats: LevelStats[];
}

export function ProgressTracker({ levels, levelStats }: ProgressTrackerProps) {
  // Work out which icon to use for each layer
  const icons: ReactElement[] = [];
  let addedFirstUncompleted = false;
  for (let i = 0; i < levels.length; i++) {
    // If stats exist for this layer, it is completed
    if (i < levelStats.length) {
      const layerStats = levelStats[i];
      icons.push(
        <LayerCompletedIcon
          key={`layer-icon-${i}`}
          result={layerStats.result}
        />,
      );
    } else {
      // Otherwise, it is ahead
      const className = addedFirstUncompleted ? undefined : styles["first"];
      icons.push(
        <LayerUncompletedIcon key={`layer-icon-${i}`} className={className} />,
      );

      if (!addedFirstUncompleted) addedFirstUncompleted = true;
    }
  }

  return <div className={styles["progress-tracker"]}>{icons}</div>;
}

function LayerUncompletedIcon({ className }: { className?: string }) {
  return (
    <div className={clsx(styles["layer-icon"], className && className)}></div>
  );
}

function LayerCompletedIcon({ result }: { result: VictoryResult }) {
  const resultIcon = result === "win" ? "✔" : "✖";

  return (
    <div className={clsx(styles["layer-icon"], styles["filled"])}>
      {resultIcon}
    </div>
  );
}
