import React from "react";
import { motion } from "framer-motion";
import { VisualMode } from "../App";

const colors = {
  dark: "from-blue-900 via-blue-800 to-purple-900",
  zen: "from-pink-100 via-blue-100 to-green-100",
  chaos: "from-yellow-400 via-pink-500 to-blue-500",
};

const WaterRippleBackground: React.FC<{ mode: VisualMode }> = ({ mode }) => (
  <motion.div
    className={`fixed inset-0 w-full h-full z-0 bg-gradient-to-br ${colors[mode]}`}
    animate={{
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{
      backgroundSize: "200% 200%",
      filter: mode === "chaos" ? "contrast(1.2) blur(1px)" : "blur(0.5px)",
      opacity: 0.95,
    }}
  />
);

export default WaterRippleBackground; 