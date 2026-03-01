import { Vulnerability } from "../../../game/vulns/compile";
import { getVulnHintFor } from "../../../game/vulns/hints";
import { VulnCheckerRow } from "./vuln-checker-row/vuln-checker-row";
import styles from "./vuln-checker.module.scss";

interface VulnerabilityCheckerProps {
  vCheckers: Vulnerability[];
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
          failed={!v.test(candidate)}
          shakeSignal={shakeSignal}
        />
      ))}
    </div>
  );
}
