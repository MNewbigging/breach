import { useEffect, useMemo, useRef } from "react";
import { FeedbackRow } from "./password-feedback-row/password-feedback-row";
import styles from "./password-feedback.module.scss";
import { CandidateFeedback } from "../../../game/core-access-level";
import { useEventUpdater } from "../../hooks/use-event-updater";

interface PasswordFeedbackProps {
  feedback: CandidateFeedback[];
}

export function PasswordFeedback({ feedback }: PasswordFeedbackProps) {
  useEventUpdater("core-access-update");
  const containerRef = useRef<HTMLDivElement>(null);

  const newestFirst = [...feedback].reverse();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [newestFirst.length]);

  return (
    <div className={styles["password-feedback"]} ref={containerRef}>
      {newestFirst.map((fb, index) => (
        <FeedbackRow key={`fb-${fb.candidate}-${index}`} feedback={fb} />
      ))}
    </div>
  );
}
