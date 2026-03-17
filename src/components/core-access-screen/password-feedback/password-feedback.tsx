import { useEffect, useRef } from "react";
import { FeedbackRow } from "./password-feedback-row/password-feedback-row";
import styles from "./password-feedback.module.scss";
import { useEventUpdater } from "../../hooks/use-event-updater";
import { CandidateFeedback } from "../../../game/levels/core-access-level";

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
      {newestFirst.length === 0 && <span>AWAITING INPUT</span>}
    </div>
  );
}
