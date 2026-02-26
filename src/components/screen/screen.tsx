import { motion, stagger, Variants } from "framer-motion";
import styles from "./screen.module.scss";
import { PropsWithChildren } from "react";

const screenVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: stagger(0.2, { from: "first" }),
    },
  },
  exit: {
    transition: {
      delayChildren: stagger(0.2, { from: "last" }),
    },
  },
};

interface ScreenProps {
  className?: string;
}

export function Screen({
  children,
  className,
}: PropsWithChildren<ScreenProps>) {
  console.log("got classname", className);
  return (
    <motion.div
      className={[styles["screen"], className].join(" ")}
      variants={screenVariants}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
    >
      {children}
    </motion.div>
  );
}
