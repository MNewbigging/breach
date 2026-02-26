import { useEffect } from "react";
import "./common-styles.scss";
import styles from "./app.module.scss";
import { AnimatePresence } from "framer-motion";
import { Screen } from "./screen/screen";
import { LayoutBlock } from "./layout-block/layout-block";
import { LoadingScreen } from "./loading-screen/loading-screen";

export function App() {
  // Puts version in title
  useEffect(() => {
    document.title = `Breach v${__APP_VERSION__}`;
  }, []);

  return (
    <div className={styles["app"]}>
      <AnimatePresence mode="wait">
        <LoadingScreen />
      </AnimatePresence>
    </div>
  );
}
