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
      icons.push(<LayerUncompletedIcon key={`layer-icon-${i}`} />);
    }
  }

  return (
    <div className={styles["progress-tracker"]}>
      {`SYSTEM PROGRESS`} {icons}
    </div>
  );
}

function LayerUncompletedIcon() {
  return <div className={styles["layer-icon"]}></div>;
}

function LayerCompletedIcon({ result }: { result: VictoryResult }) {
  const resultIcon = result === "win" ? "✔" : "✖";

  return (
    <div className={clsx(styles["layer-icon"], styles["filled"])}>
      {resultIcon}
    </div>
  );
}
