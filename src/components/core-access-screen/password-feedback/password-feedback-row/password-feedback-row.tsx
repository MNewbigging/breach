import { ReactElement } from "react";
import { CandidateFeedback } from "../../core-access-screen";
import styles from "./password-feedback-row.module.scss";

export function FeedbackRow({ feedback }: { feedback: CandidateFeedback }) {
  // Create the character feedback icons
  const feedbackIcons: ReactElement[] = [];
  feedback.charFeedback.forEach((charFb, index) => {
    const key = `${feedback.candidate}-${index}`;
    switch (charFb) {
      case "char-match":
        feedbackIcons.push(<CharMatchIcon key={key} />);
        break;
      case "pos-match":
        feedbackIcons.push(<PosMatchIcon key={key} />);
        break;
      case "miss":
        feedbackIcons.push(<MissIcon key={key} />);
        break;
    }
  });

  return (
    <div className={styles["feedback-block"]}>
      <span className={styles["candidate"]}>{`${feedback.candidate}`}</span>
      <span className={styles["feedback-icons"]}>{feedbackIcons}</span>
      <span>{`${feedback.positionsCorrect} fragments aligned`}</span>
      <span>{`${feedback.charsCorrect} fragments matched`}</span>
    </div>
  );
}

function PosMatchIcon() {
  return <span className={styles["pos-match-icon"]}>▓</span>;
}

function CharMatchIcon() {
  return <span className={styles["char-match-icon"]}>▒</span>;
}

function MissIcon() {
  return <span className={styles["miss-icon"]}>░</span>;
}
