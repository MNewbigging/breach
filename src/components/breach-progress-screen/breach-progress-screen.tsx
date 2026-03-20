import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./breach-progress-screen.module.scss";
import { VulnerabilityDisplay } from "./vulnerability-display/vulnerability-display";
import { LevelResults } from "./level-results/level-results";
import { ProgressTracker } from "./progress-tracker/progress-tracker";
import { Breach } from "../../game/breach";
import clsx from "clsx";
import { SideMenu } from "../side-menu/side-menu";
import { ScreenName } from "../../game/types";

interface BreachProgressScreenProps {
  breach: Breach;
}

export function BreachProgressScreen({ breach }: BreachProgressScreenProps) {
  // Get the next level name
  const nextLevel = breach.getNextLevel();
  const nextLevelName = getLevelName(nextLevel.screen);

  let runXp = 0;
  breach.levelStats.forEach((stat) => (runXp += stat.gainedXp));

  // const lastLevel =  const lastStats = stats.length ? stats[stats.length - 1] : undefined;
  const lastLevelStats = breach.levelStats.slice(-1)[0];
  const nextLevelDifficulty = nextLevel.difficulty;

  return (
    <Screen className={styles["breach-progress-screen"]}>
      <AnimatedBlock className={clsx(styles["section"], styles["title-bar"])}>
        {`>SYSTEM PROGRESS<`}
        <SideMenu breach={breach} />
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["section"])}>
        <ProgressTracker
          levels={breach.levels}
          levelStats={breach.levelStats}
        />
      </AnimatedBlock>

      {breach.levelStats.length > 0 && (
        <AnimatedBlock className={clsx(styles["section"])}>
          <LevelResults
            lastLevelStats={lastLevelStats}
            levelName={getLevelName(lastLevelStats.screen)}
          />
        </AnimatedBlock>
      )}

      <AnimatedBlock className={clsx(styles["section"], styles["can-grow"])}>
        <VulnerabilityDisplay awardedHints={breach.awardedHints} />
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["section"], styles["can-grow"])}>
        <div>Breach rewards so far:</div>
        <div>- Exploit tokens: {breach.exploitTokens}</div>
        <div>- Run XP: {runXp}</div>
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["section"], styles["can-grow"])}>
        <div>
          Next: {nextLevelName} {`(${nextLevelDifficulty})`}
        </div>
        <br />
        <div>Rewards:</div>
        <div>- Exploit tokens: 2</div>
        <div>- XP: 1</div>
      </AnimatedBlock>

      <AnimatedBlock>
        <Button
          size="m"
          text={`>Next: ${nextLevelName}<`}
          onClick={() => breach.startNextLevel()}
          className={styles["centered"]}
        />
      </AnimatedBlock>
    </Screen>
  );
}

function getLevelName(screen: ScreenName) {
  switch (screen) {
    case "memory-defrag-level":
      return "Memory Defrag";
    case "word-transform-level":
      return "Word Transform";
    case "core-access":
      return "Breach Core";
    default:
      return `>PARSING_ERROR<`;
  }
}
