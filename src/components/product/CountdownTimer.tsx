import React from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  timeLeft: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 sm:mb-8 px-4 py-2 sm:px-6 sm:py-3 bg-[#c9351b] text-white font-bold rounded-full shadow-lg text-center mx-4"
    >
      <span className="text-xs xs:text-sm sm:text-base">
        Redirecting to the Secured Product Page in {timeLeft} sec
      </span>
    </motion.div>
  );
}; 