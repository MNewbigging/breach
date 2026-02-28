import styles from "./password-input.module.scss";

interface PasswordInputProps {
  allChecksPassed: boolean;
  onSubmit: () => void;
  onChecksFailed: () => void;
  password: string;
  setPassword: (pw: string) => void;
}

export function PasswordInput({
  allChecksPassed,
  onSubmit,
  onChecksFailed,
  password,
  setPassword,
}: PasswordInputProps) {
  return (
    <div className={styles["password-input-block"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // stops refresh
          // Don't submit if vCheckers weren't all passed
          if (allChecksPassed) onSubmit();
          else onChecksFailed();
          //else setShakeSignal((s) => s + 1);
        }}
      >
        <span className={styles["input-prefix"]} aria-hidden="true">
          &gt;
        </span>

        <input
          name="password-input"
          type="text"
          maxLength={8}
          value={password}
          onChange={(e) => {
            const cleaned = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
            setPassword(cleaned);
          }}
          autoComplete="off"
          spellCheck={false}
        />

        <button type="submit">⏎</button>
      </form>
    </div>
  );
}
