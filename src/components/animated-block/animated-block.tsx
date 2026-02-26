import { motion, Transition, Variants } from "framer-motion";
import { PropsWithChildren } from "react";

const animatedBlock: Variants = {
  initial: { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

const animatedBlockTransition: Transition = {
  duration: 0.24,
  ease: "easeOut",
};

interface LayoutBlockProps {
  className?: string;
}

export function AnimatedBlock({
  children,
  className,
}: PropsWithChildren<LayoutBlockProps>) {
  return (
    <motion.div
      className={className}
      variants={animatedBlock}
      transition={animatedBlockTransition}
    >
      {children}
    </motion.div>
  );
}
