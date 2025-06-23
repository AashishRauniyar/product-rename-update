import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ActionButtonsProps {
  onLearnMore: () => void;
  onBuyNow: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onLearnMore, onBuyNow }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-sm sm:max-w-md mx-auto px-4"
    >
      <button
        onClick={onLearnMore}
        className="bg-white hover:bg-gray-100 text-black border-2 border-white rounded-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex-1 hover:scale-105 active:scale-95 min-h-[48px] flex items-center justify-center"
      >
        LEARN MORE
      </button>

      <button
        onClick={onBuyNow}
        className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex-1 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 min-h-[48px]"
      >
        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
        BUY NOW
      </button>
    </motion.div>
  );
}; 