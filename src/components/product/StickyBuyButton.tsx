import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap } from 'lucide-react';

interface StickyBuyButtonProps {
  onBuyNow: () => void;
  productName: string;
}

export const StickyBuyButton: React.FC<StickyBuyButtonProps> = ({ onBuyNow, productName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={onBuyNow}
        className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-4 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(239, 68, 68, 0.5)",
            "0 0 30px rgba(239, 68, 68, 0.8)",
            "0 0 20px rgba(239, 68, 68, 0.5)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
        
        {/* Lightning icon for urgency */}
        <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
        
        {/* Shopping cart icon */}
        <ShoppingCart className="h-5 w-5 group-hover:animate-bounce" />
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-extrabold tracking-wide">BUY NOW</span>
          <span className="text-xs opacity-90 font-medium">Secure Checkout</span>
        </div>

        {/* Urgency badge */}
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          LIMITED
        </div>
      </motion.button>

      {/* Floating text */}
      <motion.div
        className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        🔥 Get {productName} Now!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
      </motion.div>
    </motion.div>
  );
}; 