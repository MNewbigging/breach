import { useMemo, useRef, useState } from "react";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./core-access-screen.module.scss";
import { PasswordInput } from "./password-input/password-input";
import { VulnerabilityChecker } from "./vuln-checker/vuln-checker";
import { PasswordFeedback } from "./password-feedback/password-feedback";
import { SumHelper } from "./sum-helper/sum-helper";
import { CheatSheet } from "./cheat-sheet/cheat-sheet";
import { compileHint } from "../../game/hints/compile";
import { AttemptsLeft } from "./attempts-left/attempts-left";
import { Breach } from "../../game/breach";
import { useEventUpdater } from "../hooks/use-event-updater";
import { CoreAccessLevel } from "../../game/levels/core-access-level";

interface CoreAccessScreenProps {
  breach: Breach;
}

export function CoreAccessScreen({ breach }: CoreAccessScreenProps) {
  useEventUpdater("core-access-update");

  const levelStateRef = useRef<CoreAccessLevel | null>(null);
  if (!levelStateRef.current) {
    levelStateRef.current = new CoreAccessLevel(breach);
  }
  const levelState = levelStateRef.current;

  const [candidate, setCandidate] = useState("");
  const [shakeSignal, setShakeSignal] = useState(0);

  // Get hydrated hint classes for each awarded hint spec in the breach
  const hintCheckers = useMemo(
    () => breach.awardedHints.map((spec) => compileHint(spec)),
    [breach.awardedHints],
  );

  const allChecksPassed = hintCheckers.every((checker) =>
    checker.test(candidate),
  );
  const showSumHelper = breach.awardedHints.some((spec) => spec.type === "sum");

  return (
    <Screen className={styles["core-access-screen"]}>
      <AnimatedBlock>
        <div>{`>ACCESS SYSTEM CORE<`}</div>
      </AnimatedBlock>

      <AnimatedBlock>
        <VulnerabilityChecker
          vCheckers={hintCheckers}
          candidate={candidate}
          shakeSignal={shakeSignal}
        />
      </AnimatedBlock>

      <AnimatedBlock>
        <PasswordInput
          allChecksPassed={allChecksPassed}
          onSubmit={() => levelState.submit(candidate)}
          onChecksFailed={() => setShakeSignal((s) => s + 1)}
          password={candidate}
          setPassword={(pw) => setCandidate(pw)}
        />
      </AnimatedBlock>

      {showSumHelper && (
        <AnimatedBlock>
          <SumHelper candidate={candidate} />
        </AnimatedBlock>
      )}

      <AnimatedBlock>
        <AttemptsLeft attempts={levelState.attempts} />
      </AnimatedBlock>

      {/* {window.innerHeight >= 1000 && ( */}
      <AnimatedBlock>
        <CheatSheet />
      </AnimatedBlock>
      {/* )} */}

      <AnimatedBlock className={styles["scroll-container"]}>
        <PasswordFeedback feedback={levelState.feedback} />
      </AnimatedBlock>
    </Screen>
  );
}
