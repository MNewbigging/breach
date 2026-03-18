import { LevelStats } from "../../../game/types";
import styles from "./level-results.module.scss";

interface LevelResultsProps {
  levelName: string;
  lastLevelStats: LevelStats;
}

export function LevelResults({ levelName, lastLevelStats }: LevelResultsProps) {
  return (
    <div className={styles["level-results"]}>
      <div className={styles["level-stats"]}>
        <span>{`${levelName} results:`}</span>
        <>
          <span>{`- You ${lastLevelStats.result === "win" ? "succeeded" : "failed"}`}</span>
          <span>{`- Gained ${lastLevelStats.gainedXp} XP`}</span>
          <span>{`- Gained 2 exploit tokens`}</span>
          <span>{`- Unlocked 1 vulnerability`}</span>
        </>
      </div>
    </div>
  );
}
