import { useAnimationControls, motion } from "framer-motion";
import { useEffect } from "react";

interface VulnCheckerRowProps {
  text: string;
  failed: boolean;
  shakeSignal: number;
}

export function VulnCheckerRow({
  text,
  failed,
  shakeSignal,
}: VulnCheckerRowProps) {
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
