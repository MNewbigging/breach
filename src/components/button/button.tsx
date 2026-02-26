import clsx from "clsx";
import styles from "./button.module.scss";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <div
      className={clsx(
        styles["button"],
        disabled ? styles["disabled"] : styles["enabled"],
      )}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
