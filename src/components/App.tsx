import { useEffect, useState } from "react";
import "./common-styles.scss";
import styles from "./app.module.scss";
import { AnimatePresence } from "framer-motion";
import { Screen } from "./screen/screen";
import { LayoutBlock } from "./layout-block/layout-block";

export function App() {
  const [screenB, setScreenB] = useState(false);

  setTimeout(() => {
    setScreenB(true);
  }, 2000);

  // Puts version in title
  useEffect(() => {
    document.title = `Breach v${__APP_VERSION__}`;
  }, []);

  return (
    <div className={styles["app"]}>
      <AnimatePresence mode="wait">
        {!screenB && <DummyScreen key={"screen-1"} />}
        {screenB && <AnotherScreen key={"screen-2"} />}
      </AnimatePresence>
    </div>
  );
}

function DummyScreen() {
  return (
    <Screen className={styles["dummy-screen"]}>
      <LayoutBlock className={styles["dummy-section"]}>CONTENT 1</LayoutBlock>
      <LayoutBlock className={styles["dummy-section"]}>CONTENT 2</LayoutBlock>
      <LayoutBlock className={styles["dummy-section"]}>CONTENT 3</LayoutBlock>
    </Screen>
  );
}

function AnotherScreen() {
  return (
    <Screen className={styles["dummy-screen"]}>
      <LayoutBlock className={styles["dummy-section"]}>CONTENT 4</LayoutBlock>
      <LayoutBlock className={styles["dummy-section"]}>CONTENT 5</LayoutBlock>
      <LayoutBlock className={styles["dummy-section"]}>CONTENT 6</LayoutBlock>
    </Screen>
  );
}
