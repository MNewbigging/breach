import { useEffect, useMemo, useRef } from "react";
import { CandidateFeedback } from "../core-access-screen";
import { FeedbackRow } from "./password-feedback-row/password-feedback-row";
import styles from "./password-feedback.module.scss";

interface PasswordFeedbackProps {
  feedback: CandidateFeedback[];
}

export function PasswordFeedback({ feedback }: PasswordFeedbackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const newestFirst = useMemo(() => {
    return [...feedback].reverse();
  }, [feedback]);

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
