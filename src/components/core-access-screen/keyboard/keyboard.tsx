import styles from "./keyboard.module.scss";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

export function Keyboard({ onKeyPress }: KeyboardProps) {
  const firstRow = [..."qwertyuiop"].map((c) => (
    <Key key={c} char={c.toUpperCase()} onClick={() => onKeyPress(c)} />
  ));
  const secondRow = [..."asdfghjkl"].map((c) => (
    <Key key={c} char={c.toUpperCase()} onClick={() => onKeyPress(c)} />
  ));
  const thirdRow = [..."zxcvbnm"].map((c) => (
    <Key key={c} char={c.toUpperCase()} onClick={() => onKeyPress(c)} />
  ));

  return (
    <div className={styles["keyboard"]}>
      <div className={styles["row"]}>{firstRow}</div>
      <div className={styles["row"]}>{secondRow}</div>
      <div className={styles["row"]}>{thirdRow}</div>
    </div>
  );
}

interface KeyProps {
  char: string;
  onClick: () => void;
}

function Key({ char, onClick }: KeyProps) {
  return (
    <div className={styles["key"]} onClick={onClick}>
      <span className={styles["key-char"]}>{char}</span>
      <span className={styles["key-value"]}>{char.charCodeAt(0) - 64}</span>
    </div>
  );
}
