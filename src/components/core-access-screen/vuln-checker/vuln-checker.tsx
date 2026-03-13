import { Hint } from "../../../game/hints/compile";
import { getVulnHintFor } from "../../../game/hints/hints";
import { VulnCheckerRow } from "./vuln-checker-row/vuln-checker-row";
import styles from "./vuln-checker.module.scss";

interface VulnerabilityCheckerProps {
  vCheckers: Hint[];
  candidate: string;
  shakeSignal: number;
}

export function VulnerabilityChecker({
  vCheckers,
  candidate,
  shakeSignal,
}: VulnerabilityCheckerProps) {
  return (
    <div className={styles["vuln-checker"]}>
      <span>{`>VULNERABILITIES<`}</span>
      {vCheckers.map((v, index) => (
        <VulnCheckerRow
          key={`v-${index}`}
          text={getVulnHintFor(v.spec)}
          appearance={
            candidate.length ? (v.test(candidate) ? "pass" : "fail") : "neutral"
          }
          shakeSignal={shakeSignal}
        />
      ))}
    </div>
  );
}
