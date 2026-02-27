import { CandidateFeedback } from "../core-access-screen";
import { FeedbackRow } from "./password-feedback-row/password-feedback-row";
import styles from "./password-feedback.module.scss";

interface PasswordFeedbackProps {
  feedback: CandidateFeedback[];
}

export function PasswordFeedback({ feedback }: PasswordFeedbackProps) {
  return (
    <div className={styles["password-feedback"]}>
      {feedback.map((fb, index) => (
        <FeedbackRow key={`fb-${fb.candidate}-${index}`} feedback={fb} />
      ))}
    </div>
  );
}
