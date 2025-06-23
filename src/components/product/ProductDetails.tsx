import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { ProductData } from '../../types/Product';

interface ProductDetailsProps {
  product: ProductData;
  onBuyNow: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBuyNow }) => {
  const newImageSrc = product.new_images?.[0] || "https://images.pexels.com/photos/3652088/pexels-photo-3652088.jpeg?auto=compress&cs=tinysrgb&w=400";
  const badgeImageSrc = product.badge_image_url || "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=100";
  const extraBadge1Src = product.extra_badge_1 || "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=80";
  const extraBadge2Src = product.extra_badge_2 || "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=80";

  return (
    <section
      id="buy-now"
      className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#17414f] to-[#416f7c] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative max-w-md lg:max-w-lg"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full transform rotate-12 scale-110 blur-3xl"></div>
              
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={newImageSrc}
                  alt={`${product.new_name} bottle`}
                  className="w-[250px] h-[320px] xs:w-[280px] xs:h-[360px] sm:w-[320px] sm:h-[420px] md:w-[380px] md:h-[480px] lg:w-[400px] lg:h-[500px] object-cover rounded-lg shadow-2xl relative z-10 mx-auto"
                />
              </motion.div>
              
              <div className="absolute -top-2 -right-2 xs:-top-3 xs:-right-3 sm:-top-4 sm:-right-4 md:-top-5 md:-right-5 lg:-top-6 lg:-right-6 w-16 h-16 xs:w-18 xs:h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 lg:w-32 lg:h-32 animate-pulse z-20">
                <img
                  src={badgeImageSrc}
                  alt="Money Back Guarantee"
                  className="drop-shadow-lg w-full h-full object-cover rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 text-left order-1 lg:order-2"
          >
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {product.new_name.toUpperCase()}
            </h2>

            <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {product.description_points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start text-base sm:text-lg"
                >
                  <div className="mr-3 mt-1 text-[#00D4FF] font-bold text-lg">•</div>
                  <span className="flex-1">{point}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <button
                onClick={onBuyNow}
                className="bg-[#00A5C7] hover:bg-[#007197] text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 w-full sm:w-auto min-h-[48px] sm:min-h-[56px]"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                BUY NOW
              </button>

              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
                {product.extra_badge_1 && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <img
                      src={extraBadge1Src}
                      alt="Certification Badge 1"
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover rounded-full drop-shadow-md"
                    />
                  </motion.div>
                )}
                {product.extra_badge_2 && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <img
                      src={extraBadge2Src}
                      alt="Certification Badge 2"
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover rounded-full drop-shadow-md"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 