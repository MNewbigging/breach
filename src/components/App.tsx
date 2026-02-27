import { useEffect } from "react";
import "./common-styles.scss";
import styles from "./app.module.scss";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { useEventUpdater } from "./hooks/use-event-updater";
import { game } from "../game/game";
import { SystemSelectScreen } from "./system-select-screen/system-select-screen";
import { BreachProgressScreen } from "./breach-progress-screen/breach-progress-screen";
import { Level } from "./level/level";
import { CoreAccessScreen } from "./core-access-screen/core-access-screen";
import { BreachOverScreen } from "./breach-over-screen/breach-over-screen";

export function App() {
  useEventUpdater("screen-changed");

  // Puts version in title
  useEffect(() => {
    document.title = `Breach v${__APP_VERSION__}`;
  }, []);

  const screen = game.currentScreen;

  return (
    <div className={styles["app"]}>
      <AnimatePresence mode="wait">
        {screen === "loading" && <LoadingScreen key="loading-screen" />}
        {screen === "breach-select" && (
          <SystemSelectScreen key="system-select-screen" />
        )}
        {screen === "breach-progress" && (
          <BreachProgressScreen key="breach-progress-screen" />
        )}
        {screen === "level" && <Level key="level" />}
        {screen === "core-access" && (
          <CoreAccessScreen key="core-access-screen" />
        )}
        {screen === "breach-over" && (
          <BreachOverScreen key="breach-over-screen" />
        )}
      </AnimatePresence>
    </div>
  );
}
