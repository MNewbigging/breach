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
import clsx from "clsx";
import { SideMenu } from "../side-menu/side-menu";
import { Button } from "../button/button";
import { Keyboard } from "./keyboard/keyboard";

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

  // Get hydrated hint classes for each awarded hint spec in the breach
  const hintCheckers = useMemo(
    () => breach.awardedHints.map((spec) => compileHint(spec)),
    [breach.awardedHints],
  );

  // todo not used right now, clean up or move logic to state
  const [shakeSignal, setShakeSignal] = useState(0);
  const allChecksPassed = hintCheckers.every((checker) =>
    checker.test(candidate),
  );
  const showSumHelper = breach.awardedHints.some((spec) => spec.type === "sum");

  function onClickBarLetter(index: number) {
    const candidateArr = [...candidate];
    candidateArr.splice(index, 1);
    setCandidate(candidateArr.join(""));
  }

  function onPressKey(char: string) {
    setCandidate(candidate + char.toUpperCase());
  }

  return (
    <Screen className={styles["core-access-screen"]}>
      <AnimatedBlock className={clsx(styles["section"], styles["title-bar"])}>
        {`>SYSTEM CORE ACCESS<`}
        <SideMenu breach={breach} />
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["scroll-container"])}>
        {levelState.feedback.length > 0 && (
          <PasswordFeedback feedback={levelState.feedback} />
        )}
        {levelState.feedback.length <= 0 && (
          <div className={styles["how-to"]}>
            <div>
              You must determine the system password using the hints below.
            </div>
            <br />
            <div>
              Tap on the keyboard letters to form your guess then tap the submit
              button. Tap letters on the input bar to remove them.
            </div>
            <br />
            <div>
              Feedback on your guess will be shown in this box. It will tell you
              which letters were aligned or just matching the password.
            </div>
            <br />
            <div>
              You have limited attempts, shown to the right of the input bar -
              guess wisely!
            </div>
            <br />
            <div>
              Coming soon - use your exploit tokens to buy more hints...
            </div>
          </div>
        )}
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["v-split"])}>
        <div>
          <VulnerabilityChecker
            vCheckers={hintCheckers}
            candidate={candidate}
            shakeSignal={shakeSignal}
          />
        </div>
        <div className={styles["exploits"]}>
          <div>Exploit tokens: {breach.exploitTokens}</div>
          <Button size="s" text="Weak Hint: 1" onClick={() => {}} disabled />
          <Button size="s" text="Medium Hint: 2" onClick={() => {}} disabled />
          <Button size="s" text="Strong Hint: 3" onClick={() => {}} disabled />
        </div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["input-section"]}>
        <div className={styles["word-bar"]}>
          <span className={styles["input-prefix"]} aria-hidden="true">
            &gt;
          </span>

          <div className={styles["word-input"]}>
            {[...candidate].map((char, index) => (
              <Letter
                key={`letter-${index}`}
                char={char}
                onClick={() => onClickBarLetter(index)}
              />
            ))}
          </div>

          <Button
            size="s"
            text="⏎"
            onClick={() => levelState.submit(candidate)}
            className={styles["submit-button"]}
          />
        </div>

        <div className={styles["attempts"]}>
          Attempts: {levelState.attempts}
        </div>
      </AnimatedBlock>

      <AnimatedBlock>
        <Keyboard onKeyPress={onPressKey} />
      </AnimatedBlock>
    </Screen>
  );

  // return (
  //   <Screen className={styles["core-access-screen"]}>
  //     <AnimatedBlock>
  //       <div>{`>ACCESS SYSTEM CORE<`}</div>
  //     </AnimatedBlock>

  //     <AnimatedBlock>
  //       <VulnerabilityChecker
  //         vCheckers={hintCheckers}
  //         candidate={candidate}
  //         shakeSignal={shakeSignal}
  //       />
  //     </AnimatedBlock>

  //     <AnimatedBlock>
  //       <PasswordInput
  //         allChecksPassed={allChecksPassed}
  //         onSubmit={() => levelState.submit(candidate)}
  //         onChecksFailed={() => setShakeSignal((s) => s + 1)}
  //         password={candidate}
  //         setPassword={(pw) => setCandidate(pw)}
  //       />
  //     </AnimatedBlock>

  //     {showSumHelper && (
  //       <AnimatedBlock>
  //         <SumHelper candidate={candidate} />
  //       </AnimatedBlock>
  //     )}

  //     <AnimatedBlock>
  //       <AttemptsLeft attempts={levelState.attempts} />
  //     </AnimatedBlock>

  //     <AnimatedBlock>
  //       <CheatSheet />
  //     </AnimatedBlock>

  //     <AnimatedBlock className={styles["scroll-container"]}>
  //       <PasswordFeedback feedback={levelState.feedback} />
  //     </AnimatedBlock>
  //   </Screen>
  // );
}

interface LetterProps {
  char: string;
  onClick: () => void;
}

function Letter({ char, onClick }: LetterProps) {
  return (
    <div className={"letter"} onClick={onClick}>
      {char}
    </div>
  );
}
