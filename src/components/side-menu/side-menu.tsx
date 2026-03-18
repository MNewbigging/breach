import { useState } from "react";
import { Breach } from "../../game/breach";
import styles from "./side-menu.module.scss";
import { Button } from "../button/button";

interface SideMenuProps {
  breach: Breach;
}

export function SideMenu({ breach }: SideMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={styles["container"]}>
      <Button size="s" text="[=]" onClick={() => setShowMenu(true)} />

      {showMenu && (
        <div className={styles["menu"]}>
          <Button
            size="s"
            text="[x]"
            onClick={() => setShowMenu(false)}
            className={styles["close-button"]}
          />

          <div>Version: 0.3.5</div>
          <div>
            Seed: <span className={styles["selectable"]}>{breach.seed}</span>
          </div>

          <Button
            size="m"
            text="Abandon Run"
            onClick={() => {
              setShowMenu(false);
              breach.abandon();
            }}
          />
        </div>
      )}
    </div>
  );
}
