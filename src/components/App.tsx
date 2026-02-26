import { useEffect } from "react";
import "./common-styles.scss";
import styles from "./app.module.scss";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { useEventUpdater } from "./hooks/use-event-updater";
import { game } from "../game/game";
import { SystemSelectScreen } from "./system-select-screen/system-select-screen";

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
        {screen === "system-select" && (
          <SystemSelectScreen key="system-select-screen" />
        )}
      </AnimatePresence>
    </div>
  );
}
