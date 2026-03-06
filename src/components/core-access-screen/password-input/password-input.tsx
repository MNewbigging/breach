import { useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;

    // Save cursor position
    const start = input.selectionStart!;

    // Sanitise input value
    const rawValue = input.value;
    const cleanedValue = rawValue.toUpperCase().replace(/[^A-Z]/g, "");
    setPassword(cleanedValue);

    // Restore cursor after state update
    requestAnimationFrame(() => {
      if (!inputRef.current) return;

      const beforeCursor = rawValue.slice(0, start);
      const cleanedBeforeCursor = beforeCursor
        .toUpperCase()
        .replace(/[^A-Z]/g, "");

      const newCursorPos = cleanedBeforeCursor.length;
      inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  return (
    <div className={styles["password-input-block"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // stops refresh
          // Don't submit if vCheckers weren't all passed
          if (allChecksPassed) onSubmit();
          else onChecksFailed();
        }}
      >
        <span className={styles["input-prefix"]} aria-hidden="true">
          &gt;
        </span>

        <input
          ref={inputRef}
          name="password-input"
          type="text"
          maxLength={8}
          value={password}
          onChange={onChange}
          autoComplete="off"
          spellCheck={false}
        />

        <button type="submit">⏎</button>
      </form>
    </div>
  );
}
