import { ReactElement } from "react";
import { game, VictoryResult } from "../../../game/game";
import styles from "./progress-tracker.module.scss";
import clsx from "clsx";

export function ProgressTracker() {
  const breach = game.currentBreach;
  if (!breach) return null;

  const layers = breach.securityLayers;
  const results = breach.securityLayerResults;

  // Work out which icon to use for each layer
  const icons: ReactElement[] = [];
  for (let i = 0; i < layers.length; i++) {
    // If stats exist for this layer, it is completed
    if (i < results.length) {
      const layerStats = results[i];
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
      {`${breach.systemName.toUpperCase()} PROGRESS`} {icons}
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
