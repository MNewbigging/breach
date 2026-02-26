import styles from "./button.module.scss";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export function Button({ text, onClick }: ButtonProps) {
  return <div onClick={onClick}>{text}</div>;
}
