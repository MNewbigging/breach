import { useAnimationControls, motion } from "framer-motion";
import { useEffect } from "react";
import styles from "./vuln-checker-row.module.scss";
import clsx from "clsx";

interface VulnCheckerRowProps {
  text: string;
  appearance: "pass" | "fail" | "neutral";
  shakeSignal: number;
}

export function VulnCheckerRow({
  text,
  appearance,
  shakeSignal,
}: VulnCheckerRowProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (appearance === "fail") {
      controls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.25 },
      });
    }
  }, [shakeSignal]);

  let prefix = "";
  if (appearance === "fail") prefix = "✖";
  if (appearance === "pass") prefix = "✔";

  return (
    <motion.div animate={controls} className={clsx(styles[appearance])}>
      {prefix} {text}
    </motion.div>
  );
}
