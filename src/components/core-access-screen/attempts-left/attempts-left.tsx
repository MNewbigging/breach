import styles from "./attempts-left.module.scss";

interface AttemptsLeftProps {
  attempts: number;
}

export function AttemptsLeft({ attempts }: AttemptsLeftProps) {
  return (
    <div
      className={styles["attempts-left"]}
    >{`${attempts} attempts til detection`}</div>
  );
}
