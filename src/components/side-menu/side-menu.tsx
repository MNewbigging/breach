import { useState } from "react";
import { Breach } from "../../game/breach";
import styles from "./side-menu.module.scss";

interface SideMenuProps {
  breach: Breach;
}

export function SideMenu({ breach }: SideMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={styles["container"]}>
      <div className={styles["button"]} onClick={() => setShowMenu(true)}>
        [=]
      </div>

      <div className={styles["menu"]}>
        <button onClick={() => setShowMenu(false)}>[x]</button>

        <div>Version: 0.3.5</div>
        <div>Seed: {breach.seed}</div>

        <button>Abandon Run</button>
      </div>
    </div>
  );
}
