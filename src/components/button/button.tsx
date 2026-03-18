import clsx from "clsx";
import styles from "./button.module.scss";

interface ButtonProps {
  text: string;
  onClick: () => void;
  size: "s" | "m" | "l";
  disabled?: boolean;
}

export function Button({ text, onClick, size, disabled = false }: ButtonProps) {
  return (
    <div
      className={clsx(
        styles["button"],
        disabled ? styles["disabled"] : styles["enabled"],
        styles[size],
      )}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
