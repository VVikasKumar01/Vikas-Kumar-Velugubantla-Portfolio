import React from "react";
import { motion } from "motion/react";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}

export default function Marquee({ items, direction = "left", speed = 25 }: MarqueeProps) {
  // Seamless marquee needs duplicate items to look continuous
  const doubledItems = [...items, ...items, ...items];
  const directionMultiplier = direction === "left" ? "-50%" : "50%";

  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-4 border-y border-neutral-100 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/50 backdrop-blur-sm relative">
      {/* Gradients to fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-50 dark:from-[#0b1121] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-50 dark:from-[#0b1121] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="inline-flex gap-8 px-4"
        animate={{
          x: [direction === "left" ? "0%" : "-50%", direction === "left" ? "-50%" : "0%"]
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity
        }}
      >
        {doubledItems.map((item, index) => (
          <span
            key={index}
            className="text-sm font-mono tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-amber-400" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
