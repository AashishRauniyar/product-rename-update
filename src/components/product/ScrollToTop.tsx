import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSmallVisible, setIsSmallVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      
      console.log('Scroll position:', scrolled); // Debug log
      
      if (scrolled > 50) {
        setIsSmallVisible(true);
      } else {
        setIsSmallVisible(false);
      }

      if (scrolled > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    toggleVisibility();
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {/* Small arrow button - shows when scrolled a little (100px) */}
      {isSmallVisible && !isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[9999] bg-[#00D4FF] hover:bg-[#00B8E6] text-black p-2 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group"
          whileHover={{ scale: 1.2, opacity: 1 }}
          whileTap={{ scale: 0.8 }}
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}

      {/* Full arrow button - shows when scrolled more (300px) */}
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[9999] bg-[#00D4FF] hover:bg-[#00B8E6] text-black p-3 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Back to Top
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}; 