import { LevelStats } from "../../../game/types";
import styles from "./level-results.module.scss";

interface LevelResultsProps {
  stats: LevelStats[];
}

export function LevelResults({ stats }: LevelResultsProps) {
  // Grab last level stats
  const lastStats = stats.length ? stats[stats.length - 1] : undefined;

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
