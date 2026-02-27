import { useMemo, useState } from "react";
import { game } from "../../game/game";
import { compileVulnerability } from "../../game/vulnerability-generator";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./core-access-screen.module.scss";
import { PasswordInput } from "./password-input/password-input";
import { VulnerabilityChecker } from "./vuln-checker/vuln-checker";
import { PasswordFeedback } from "./password-feedback/password-feedback";

export interface CandidateFeedback {
  candidate: string;
  charsCorrect: number;
  positionsCorrect: number;
  feedbackString: string;
}

export function CoreAccessScreen() {
  const [candidate, setCandidate] = useState("");
  const [shakeSignal, setShakeSignal] = useState(0);
  const [feedback, setFeedback] = useState<CandidateFeedback[]>([]);

  const breach = game.currentBreach;
  if (!breach) return null;

  // Get hydrated V classes for each awarded vSpec in the breach
  const vCheckers = useMemo(
    () => breach.awardedVulns.map((spec) => compileVulnerability(spec)),
    [breach.awardedVulns],
  );

  const allChecksPassed = vCheckers.every((v) => v.test(candidate));

  // On submit input, run mastermind feedback checks and display
  function onSubmit() {
    const breach = game.currentBreach;
    if (!breach) return null;

    const { charsCorrect, positionsCorrect, feedbackString } =
      getCandidateFeedback(candidate, breach.corePassword);

    setFeedback([
      ...feedback,
      { candidate, charsCorrect, positionsCorrect, feedbackString },
    ]);

    // Check for a win
    if (positionsCorrect === breach.corePassword.length) {
      // Play some cool animation
      setTimeout(() => {
        game.concludeCore("win");
      }, 1000);
    }
  }

  return (
    <Screen className={styles["core-access-screen"]}>
      <AnimatedBlock className={styles["top"]}>
        <div>{`>ACCESS ${breach.systemName.toUpperCase()} SYSTEM CORE<`}</div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["two-column"]}>
        <AnimatedBlock className={styles["left-column"]}>
          <VulnerabilityChecker
            vCheckers={vCheckers}
            candidate={candidate}
            shakeSignal={shakeSignal}
          />

          <PasswordInput
            allChecksPassed={allChecksPassed}
            onSubmit={onSubmit}
            onChecksFailed={() => setShakeSignal((s) => s + 1)}
            password={candidate}
            setPassword={(pw) => setCandidate(pw)}
          />
        </AnimatedBlock>

        <AnimatedBlock className={styles["right-column"]}>
          <PasswordFeedback feedback={feedback} />
        </AnimatedBlock>
      </AnimatedBlock>
    </Screen>
  );
}

function getCandidateFeedback(candidate: string, pw: string) {
  let charsCorrect = 0;
  let positionsCorrect = 0;

  const pwArr = [...pw];
  const candidateArr = [...candidate];
  const feedback: string[] = Array(candidate.length).fill("░");

  // First pass — exact matches
  for (let i = 0; i < candidateArr.length; i++) {
    if (candidateArr[i] === pwArr[i]) {
      positionsCorrect++;
      feedback[i] = "▓";
      pwArr[i] = null as any; // consume
      candidateArr[i] = null as any; // consume
    }
  }

  // Second pass — character matches (wrong position)
  for (let i = 0; i < candidateArr.length; i++) {
    if (candidateArr[i] && pwArr.includes(candidateArr[i])) {
      charsCorrect++;
      feedback[i] = "▒";

      const index = pwArr.indexOf(candidateArr[i]);
      pwArr[index] = null as any; // consume matched char so dupes don't re-match
    }
  }

  return {
    charsCorrect,
    positionsCorrect,
    feedbackString: feedback.join(" "),
  };
}
