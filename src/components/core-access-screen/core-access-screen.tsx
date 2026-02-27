import { useEffect, useMemo, useState } from "react";
import { game } from "../../game/game";
import {
  compileVulnerability,
  getVulnHintFor,
} from "../../game/vulnerability-generator";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Button } from "../button/button";
import { Screen } from "../screen/screen";
import styles from "./core-access-screen.module.scss";
import { motion, useAnimationControls } from "framer-motion";

export function CoreAccessScreen() {
  const [candidate, setCandidate] = useState("");
  const [shakeSignal, setShakeSignal] = useState(0);

  const breach = game.currentBreach;
  if (!breach) return null;

  // Get hydrated V classes for each awarded vSpec in the breach
  const vCheckers = useMemo(
    () => breach.awardedVulns.map((spec) => compileVulnerability(spec)),
    [breach.awardedVulns],
  );

  const allChecksPassed = vCheckers.every((v) => v.test(candidate));

  // On submit input, run separate mastermind feedback checks and display
  function onSubmit() {
    console.log("testing", candidate);
  }

  return (
    <Screen className={styles["core-access-screen"]}>
      <AnimatedBlock className={styles["vuln-checker"]}>
        <span>{`>VULNERABILITIES<`}</span>
        {vCheckers.map((v, index) => (
          <VCheckerRow
            key={`v-${index}`}
            text={getVulnHintFor(v.spec)}
            failed={!v.test(candidate)}
            shakeSignal={shakeSignal}
          />
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={styles["password-input-block"]}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // stops refresh
            // Don't submit if vCheckers weren't all passed
            if (allChecksPassed) onSubmit();
            else setShakeSignal((s) => s + 1);
          }}
        >
          <span className={styles["input-prefix"]} aria-hidden="true">
            &gt;
          </span>

          <input
            name="password-input"
            type="text"
            maxLength={8}
            value={candidate}
            onChange={(e) => setCandidate(e.target.value.toUpperCase())}
            autoComplete="off"
            spellCheck={false}
          />

          <button type="submit">⏎</button>
        </form>
      </AnimatedBlock>

      <AnimatedBlock className={styles["password-feedback"]}></AnimatedBlock>

      <AnimatedBlock>
        <Button text={"Win Core"} onClick={() => game.concludeCore("win")} />
      </AnimatedBlock>

      <AnimatedBlock>
        <Button text={"Lose Core"} onClick={() => game.concludeCore("lose")} />
      </AnimatedBlock>
    </Screen>
  );
}

interface VCheckerRowProps {
  text: string;
  failed: boolean;
  shakeSignal: number;
}

function VCheckerRow({ text, failed, shakeSignal }: VCheckerRowProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (failed) {
      controls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.25 },
      });
    }
  }, [shakeSignal]);

  return (
    <motion.div animate={controls}>
      {failed ? "✖" : "✔"} {text}
    </motion.div>
  );
}
