import styles from "./sum-helper.module.scss";

interface SumHelperProps {
  candidate: string;
}

export function SumHelper({ candidate }: SumHelperProps) {
  const values = [...candidate].map((c) => getCharValue(c));
  const total = values.reduce((total, value) => (total += value), 0);

  return (
    <div
      className={styles["sum-helper"]}
    >{`> ${values.join(" + ")} = ${total}`}</div>
  );
}

function getCharValue(c: string) {
  return c.charCodeAt(0) - 64;
}
