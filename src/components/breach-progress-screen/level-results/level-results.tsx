import { game } from "../../../game/game";
import styles from "./level-results.module.scss";

export function LevelResults() {
  const breach = game.currentBreach;
  if (!breach) return null;

  // Grab last level stats
  const lastStats = breach.securityLayerStats.length
    ? breach.securityLayerStats[breach.securityLayerStats.length - 1]
    : undefined;

  return (
    <div className={styles["level-results"]}>
      <div className={styles["level-stats"]}>
        <span>{`>LAST LAYER RESULTS<`}</span>
        {lastStats && (
          <>
            <span>{`You ${lastStats.result === "win" ? "succeeded" : "failed"}`}</span>
            <span>{`XP Gained: ${lastStats.gainedXp}`}</span>
          </>
        )}
      </div>
    </div>
  );
}
