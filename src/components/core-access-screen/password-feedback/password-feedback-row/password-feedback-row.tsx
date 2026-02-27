import { CandidateFeedback } from "../core-access-screen";
import styles from "./password-feedback-row.module.scss";

export function FeedbackRow({ feedback }: { feedback: CandidateFeedback }) {
  return (
    <div className={styles["feedback-block"]}>
      <span>{`> ${feedback.candidate}`}</span>
      <span>{feedback.feedbackString}</span>
      <span>{`${feedback.positionsCorrect} fragments aligned`}</span>
      <span>{`${feedback.charsCorrect} fragments matched`}</span>
    </div>
  );
}
