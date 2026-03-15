import { useEffect } from "react";
import "./common-styles.scss";
import styles from "./app.module.scss";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { useEventUpdater } from "./hooks/use-event-updater";
import { game } from "../game/game";
import { SystemSelectScreen } from "./system-select-screen/system-select-screen";
import { BreachProgressScreen } from "./breach-progress-screen/breach-progress-screen";
import { CoreAccessScreen } from "./core-access-screen/core-access-screen";
import { BreachOverScreen } from "./breach-over-screen/breach-over-screen";
import { MemoryDefragScreen } from "./memory-defrag-screen/memory-defrag-screen";
import { WordTransformScreen } from "./word-transform-screen/word-transform-screen";

export function App() {
  useEventUpdater("screen-changed");

  // Puts version in title
  useEffect(() => {
    document.title = `Breach v${__APP_VERSION__}`;
  }, []);

  const screen = game.currentScreen;
  const breach = game.breach;

  return (
    <div className={styles["app"]}>
      <AnimatePresence mode="wait">
        {screen === "loading" && <LoadingScreen key="loading-screen" />}
        {screen === "breach-select" && (
          <SystemSelectScreen key="system-select-screen" />
        )}
        {screen === "breach-progress" && breach && (
          <BreachProgressScreen key="breach-progress-screen" breach={breach} />
        )}
        {screen === "core-access" && breach && (
          <CoreAccessScreen key="core-access-screen" breach={breach} />
        )}
        {screen === "breach-over" && breach && (
          <BreachOverScreen key="breach-over-screen" breach={breach} />
        )}
        {screen === "memory-defrag-level" && game.dictionary && breach && (
          <MemoryDefragScreen dictionary={game.dictionary} breach={breach} />
        )}
        {screen === "word-transform-level" && game.dictionary && breach && (
          <WordTransformScreen breach={breach} dictionary={game.dictionary} />
        )}
      </AnimatePresence>
    </div>
  );
}
