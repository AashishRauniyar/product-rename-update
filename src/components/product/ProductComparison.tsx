import React from 'react';
import { motion } from 'framer-motion';
import { ProductData } from '../../types/Product';

interface ProductComparisonProps {
  product: ProductData;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ product }) => {
  const oldImageSrc = product.old_images?.[0] || "https://images.pexels.com/photos/3652912/pexels-photo-3652912.jpeg?auto=compress&cs=tinysrgb&w=400";
  const newImageSrc = product.new_images?.[0] || "https://images.pexels.com/photos/3652088/pexels-photo-3652088.jpeg?auto=compress&cs=tinysrgb&w=400";
  const badgeImageSrc = product.badge_image_url || "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=100";

  return (
    <div className="relative flex flex-row md:flex-row items-center justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-12 lg:gap-16 xl:gap-20 w-full max-w-7xl mx-auto mb-12 md:mb-16 px-4">
      {/* Background Text Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div 
          className="font-black text-white/5 select-none leading-[0.8] text-center"
          style={{ 
            fontSize: 'clamp(1.5rem, 8vw, 8rem)',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.03)',
            transform: 'translateY(-10%)',
            maxWidth: '100%',
            wordBreak: 'break-word'
          } as React.CSSProperties}
        >
          {product.new_name.toUpperCase()}
        </div>
      </div>

      {/* Old Product */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col items-center relative z-10 flex-1"
      >
        <div className="relative">
          <img
            src={oldImageSrc}
            alt={`${product.old_name} bottle`}
            className="w-[120px] h-[160px] xs:w-[140px] xs:h-[180px] sm:w-[180px] sm:h-[240px] md:w-[250px] md:h-[320px] lg:w-[300px] lg:h-[400px] object-cover rounded-lg shadow-2xl"
          />
        </div>
        <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-6 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1 xs:px-3 xs:py-2 sm:px-4 sm:py-2 md:px-6 md:py-3">
          <span className="text-white font-bold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-center block">
            {product.old_name}
          </span>
        </div>
      </motion.div>

      {/* Arrow - Responsive Design */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex justify-center items-center relative z-10 flex-shrink-0"
      >
        <motion.div
          className="relative"
          animate={{
            x: [0, 4, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          {/* Mobile Arrow - Smaller and Vertical */}
          <div className="block md:hidden">
            <svg
              width="60"
              height="35"
              viewBox="0 0 137 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-5 xs:w-10 xs:h-6 sm:w-12 sm:h-7"
            >
              <path
                d="M136.12 37.9008L80.7866 0V20.2137H37.6266V55.5878H80.7866V75.8015L136.12 37.9008Z"
                fill="#00D4FF"
              />
              <path
                d="M18.8134 20.2137H29.88V55.5878H18.8134V20.2137Z"
                fill="#00D4FF"
              />
              <path
                d="M0 20.2137H11.0667V55.5878H0V20.2137Z"
                fill="#00D4FF"
              />
            </svg>
          </div>
          
          {/* Desktop Arrow - Original Size */}
          <div className="hidden md:block">
            <svg
              width="137"
              height="76"
              viewBox="0 0 137 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-10 lg:w-20 lg:h-12 xl:w-28 xl:h-16"
            >
              <path
                d="M136.12 37.9008L80.7866 0V20.2137H37.6266V55.5878H80.7866V75.8015L136.12 37.9008Z"
                fill="#00D4FF"
              />
              <path
                d="M18.8134 20.2137H29.88V55.5878H18.8134V20.2137Z"
                fill="#00D4FF"
              />
              <path
                d="M0 20.2137H11.0667V55.5878H0V20.2137Z"
                fill="#00D4FF"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* New Product */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="flex flex-col items-center relative z-10 flex-1"
      >
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.03, 1],
            y: [0, -8, 0] 
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <img
            src={newImageSrc}
            alt={`${product.new_name} bottle`}
            className="w-[120px] h-[160px] xs:w-[140px] xs:h-[180px] sm:w-[180px] sm:h-[240px] md:w-[250px] md:h-[320px] lg:w-[300px] lg:h-[400px] object-cover rounded-lg shadow-2xl"
          />
          <div className="absolute -top-2 -right-2 xs:-top-3 xs:-right-3 sm:-top-4 sm:-right-4 md:-top-5 md:-right-5 lg:-top-6 lg:-right-6 w-16 h-16 xs:w-18 xs:h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 lg:w-32 lg:h-32 animate-pulse z-10">
            <img
              src={badgeImageSrc}
              alt="Money Back Guarantee"
              className="drop-shadow-lg w-full h-full object-cover rounded-full  "
            />
          </div>
        </motion.div>
        <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-6 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1 xs:px-3 xs:py-2 sm:px-4 sm:py-2 md:px-6 md:py-3">
          <span className="text-white font-bold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-center block">
            {product.new_name}
          </span>
        </div>
      </motion.div>
    </div>
  );
}; 