import { motion, Transition, Variants } from "framer-motion";
import styles from "./layout-block.module.scss";
import { PropsWithChildren } from "react";

const layoutBlockVariants: Variants = {
  initial: { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

const layoutBlockTransition: Transition = {
  duration: 0.24,
  ease: "easeOut",
};

interface LayoutBlockProps {
  className?: string;
}

export function LayoutBlock({
  children,
  className,
}: PropsWithChildren<LayoutBlockProps>) {
  return (
    <motion.div
      className={[styles["layout-block"], className].join(" ")}
      variants={layoutBlockVariants}
      transition={layoutBlockTransition}
    >
      {children}
    </motion.div>
  );
}
