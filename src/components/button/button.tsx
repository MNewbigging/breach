import clsx from "clsx";
import styles from "./button.module.scss";

interface ButtonProps {
  text: string;
  onClick: () => void;
  size: "s" | "m" | "l";
  className?: string;
  disabled?: boolean;
}

export function Button({
  text,
  onClick,
  size,
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <div
      className={clsx(
        styles["button"],
        disabled ? styles["disabled"] : styles["enabled"],
        styles[size],
        className,
      )}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
