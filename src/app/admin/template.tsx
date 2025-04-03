"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

export default function Template({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 150 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}
