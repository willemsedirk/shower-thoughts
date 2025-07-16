import React from "react";
import { motion } from "framer-motion";
import { VisualMode } from "../App";

const bubbleColors = {
  dark: "bg-blue-300/40",
  zen: "bg-pink-200/40",
  chaos: "bg-yellow-400/60",
};

const BubbleAnimation: React.FC<{ children: React.ReactNode; mode: VisualMode }> = ({
  children,
  mode,
}) => (
  <div className="relative inline-block">
    {[...Array(7)].map((_, i) => (
      <motion.span
        key={i}
        className={`absolute rounded-full ${bubbleColors[mode]}`}
        style={{
          width: 24 + Math.random() * 16,
          height: 24 + Math.random() * 16,
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 90}%`,
          zIndex: -1,
        }}
        animate={{
          y: [0, -20 - Math.random() * 30],
          opacity: [0.7, 0.2, 0.7],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random(),
        }}
      />
    ))}
    <span className="relative z-10">{children}</span>
  </div>
);

export default BubbleAnimation; 