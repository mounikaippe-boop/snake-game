import React from 'react';
import { motion } from 'motion/react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 w-full h-full text-neon-cyan opacity-0 group-hover:opacity-70 z-0"
        animate={{
          x: [0, -2, 2, -1, 0],
          y: [0, 1, -1, 2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 w-full h-full text-neon-magenta opacity-0 group-hover:opacity-70 z-0"
        animate={{
          x: [0, 2, -2, 1, 0],
          y: [0, -1, 1, -2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
          delay: 0.1,
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};
