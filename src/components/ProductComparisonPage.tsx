"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

// Define TypeScript interface for our product data
interface ProductData {
  id: string;
  old_name: string;
  new_name: string;
  description: string;
  description_points: string[];
  rename_reason: string;
  old_images: string[];
  new_images: string[];
  badge_image_url: string | null;
  extra_badge_1: string | null;
  extra_badge_2: string | null;
  next_redirect_url: string;
  redirect_timer: number;
  theme: string;
  generated_link: string;
  page_title: string;
  popup_title: string;
  total_clicks: number;
}

export default function ProductRebrand() {
  // State variables
  const [timeLeft, setTimeLeft] = useState(10);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Router and params
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  // Fetch product data
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Extract product ID from slug
        const idMatch = slug.match(
          /-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
        );
        const productId = idMatch ? idMatch[1] : slug;

        // Log the extraction for debugging
        console.log(`Extracting product ID from slug: ${slug} -> ${productId}`);

        // Make API request
        const response = await axios.get(`/api/product/${productId}`);

        // Check response status
        if (response.status !== 200) {
          throw new Error(`API returned status code ${response.status}`);
        }

        const productData = response.data;

        if (!productData) {
          throw new Error("Product not found or empty response");
        }

        // Process the product data - handle potential JSON strings
        const processedProduct = {
          ...productData,
          old_images: Array.isArray(productData.old_images)
            ? productData.old_images
            : JSON.parse(productData.old_images || "[]"),
          new_images: Array.isArray(productData.new_images)
            ? productData.new_images
            : JSON.parse(productData.new_images || "[]"),
          description_points: Array.isArray(productData.description_points)
            ? productData.description_points
            : JSON.parse(productData.description_points || "[]"),
        };

        console.log("Successfully fetched product data:", processedProduct.id);

        // Track page view by making a request to the visit tracking endpoint
        try {
          await axios.post(`/api/analytics/visit`, {
            productId: processedProduct.id,
          });
        } catch (visitError) {
          console.warn("Failed to track visit:", visitError);
        }

        setProduct(processedProduct);
        setTimeLeft(processedProduct.redirect_timer || 10);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);

        // Set specific error message
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError("Product not found");
          } else {
            setError(`API error: ${error.message}`);
          }
        } else {
          setError(
            `Unexpected error: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }

        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0 || !product?.next_redirect_url) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Redirect when timer reaches zero
          if (product.next_redirect_url) {
            handleBuyNow();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, product]);

  // Animation visibility effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scroll to second section function
  const scrollToSecondSection = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle buy now button click
  const handleBuyNow = () => {
    if (product?.next_redirect_url) {
      if (product.next_redirect_url.startsWith("#")) {
        // If it's a hash link, scroll to that section
        const element = document.querySelector(product.next_redirect_url);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Otherwise navigate to the URL
        router.push(product.next_redirect_url);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e6f4f9] to-[#d1ebf5] flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1d4e5f]/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#1d4e5f] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#1d4e5f] animate-pulse text-xl font-medium">
            Loading product information...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e6f4f9] to-[#d1ebf5] flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-[#1d4e5f] mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The requested product could not be found. Please check the URL and try again."}
          </p>
          <Button
            className="bg-[#1d4e5f] hover:bg-[#16404e] text-white"
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </div>
      </main>
    );
  }

  // Get image sources with fallbacks
  const oldImageSrc =
    product.old_images && product.old_images.length > 0
      ? product.old_images[0]
      : "/placeholder.svg?text=Old+Product";

  const newImageSrc =
    product.new_images && product.new_images.length > 0
      ? product.new_images[0]
      : "/placeholder.svg?text=New+Product";

  // Get badge image sources with fallbacks
  const badgeImageSrc =
    product.badge_image_url || "/placeholder.svg?text=Guarantee";
  const extraBadge1Src =
    product.extra_badge_1 || "/placeholder.svg?text=Badge+1";
  const extraBadge2Src =
    product.extra_badge_2 || "/placeholder.svg?text=Badge+2";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6f4f9] via-[#d9eef6] to-[#d1ebf5] overflow-hidden text-center">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] select-none pointer-events-none">
          <div className="absolute top-[20%] left-[10%] sm:left-[20%] text-[40px] sm:text-[50px] md:text-[100px] lg:text-[150px] font-extrabold text-[#1d4e5f] whitespace-nowrap animate-float-slow">
            {product.new_name}
          </div>
          <div className="absolute top-[40%] left-[10%] sm:left-[20%] text-[40px] sm:text-[50px] md:text-[100px] lg:text-[150px] font-extrabold text-[#1d4e5f] whitespace-nowrap animate-float-slow-reverse">
            {product.new_name}
          </div>
          <div className="absolute top-[60%] left-[10%] sm:left-[20%] text-[40px] sm:text-[50px] md:text-[100px] lg:text-[150px] font-extrabold text-[#1d4e5f] whitespace-nowrap animate-float-slow">
            {product.new_name}
          </div>
        </div>

        {/* Animated Blob Effects */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-300/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-300/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/3 w-60 h-60 bg-red-300/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* First Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-16 lg:py-20">
        {/* Timer */}
        {timeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-8 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full shadow-lg animate-pulse-glow"
          >
            <span className="animate-pulse text-sm xs:text-base">
              Hurry! Slots Available only {timeLeft.toString().padStart(2, "0")}{" "}
              sec
            </span>
          </motion.div>
        )}

        {/* Counter */}
        {product.total_clicks > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-3 sm:mb-4 bg-[#1d4e5f] text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs xs:text-sm font-medium"
          >
            {product.total_clicks}+ visitors have viewed this page
          </motion.div>
        )}

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-4 sm:mb-6 max-w-4xl px-2"
        >
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-4">
            <span className="text-[#1d4e5f]">{product.old_name}</span>{" "}
            <span className="text-[#1d4e5f] font-normal">
              HAS BEEN RENAMED TO
            </span>{" "}
          </h1>
          <div className="relative">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black text-[#e84118] tracking-wider mb-2 sm:mb-4 drop-shadow-md">
              {product.new_name}
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shine"></div>
          </div>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-[#1d4e5f] font-medium">
            DUE TO COUNTERFEIT ISSUES
          </p>
        </motion.div>

        {/* Product Comparison */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 w-full max-w-5xl px-2 sm:px-4">
          {/* Old Product */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center z-10 w-full sm:w-2/5 md:w-1/3"
          >
            <div className="relative w-full max-w-[250px] group">
              <Image
                src={oldImageSrc || "/placeholder.svg"}
                alt={`${product.old_name} bottle`}
                width={300}
                height={400}
                style={{ objectFit: "contain" }}
                className="p-2 transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <span className="text-[#1d4e5f] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mt-2">
              {product.old_name}
            </span>
          </motion.div>

          {/* Animated Arrow - Enhanced multi-arrow animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center items-center z-10 my-2 sm:my-0"
          >
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg">
              <div className="flex items-center justify-center">
                {[0, 1, 2].map((index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 animate-arrow-slide"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>

          {/* New Product */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col items-center z-10 w-full sm:w-2/5 md:w-1/3"
          >
            <motion.div
              className="relative w-full max-w-[250px] mb-4 group"
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 animate-pulse-slow opacity-70">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent animate-shine"></div>
              </div>
              <Image
                src={newImageSrc || "/placeholder.svg"}
                alt={`${product.new_name} bottle`}
                width={300}
                height={400}
                style={{ objectFit: "contain" }}
                className="p-2 drop-shadow-lg transform group-hover:scale-110 transition-all duration-300"
              />
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 animate-bounce-slow">
                <Image
                  src={badgeImageSrc || "/placeholder.svg"}
                  alt="Money Back Guarantee"
                  width={100}
                  height={100}
                  className="drop-shadow-lg"
                />
              </div>
            </motion.div>
            <span className="text-[#e84118] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mt-2">
              {product.new_name}
            </span>
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-row gap-4 justify-center mt-8 sm:mt-12 w-full max-w-md mx-auto px-4"
        >
          <Button
            onClick={scrollToSecondSection}
            variant="outline"
            className="bg-white hover:bg-gray-100 text-[#1d4e5f] border-[#1d4e5f] rounded-full px-4 sm:px-6 py-5 sm:py-6 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 w-1/2 relative overflow-hidden group"
          >
            <span className="relative z-10">LEARN MORE</span>
            <span className="absolute inset-0 bg-[#1d4e5f] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </Button>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="w-1/2"
          >
            <Button
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-[#e84118] to-[#e74c3c] hover:from-[#d63010] hover:to-[#c0392b] text-white rounded-full px-4 sm:px-6 py-5 sm:py-6 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 w-full relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> BUY NOW
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={scrollToSecondSection}
        >
          <ChevronDown className="h-8 w-8 text-[#1d4e5f]" />
        </motion.div>
      </section>

      {/* Second Section */}
      <section
        ref={secondSectionRef}
        id="buy-now"
        className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Product Image */}
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -z-10 w-36 h-36 xs:w-48 xs:h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full -left-4 xs:-left-6 sm:-left-10 top-20 blur-md"></div>
                <motion.div
                  className="relative w-48 h-64 xs:w-64 xs:h-80 sm:w-72 sm:h-96"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={newImageSrc || "/placeholder.svg"}
                    alt={`${product.new_name} bottle`}
                    width={300}
                    height={400}
                    style={{ objectFit: "contain" }}
                    className="drop-shadow-xl"
                  />
                </motion.div>
                <div className="absolute -top-4 -right-4 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 animate-pulse-slow">
                  <Image
                    src={badgeImageSrc || "/placeholder.svg"}
                    alt="Money Back Guarantee"
                    width={100}
                    height={100}
                    className="drop-shadow-lg"
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
              className="md:w-1/2"
            >
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1d4e5f] mb-4 sm:mb-6">
                <span className="text-[#e84118]">{product.new_name}</span>{" "}
                UPGRADE
              </h2>

              <p className="text-[#1d4e5f] mb-4 sm:mb-6 text-sm xs:text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {product.description_points.map(
                  (point: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start text-[#1d4e5f] text-sm xs:text-base sm:text-lg"
                    >
                      <div className="mr-2 sm:mr-3 mt-1 bg-gradient-to-r from-green-400 to-green-500 p-1 rounded-full text-white">
                        <Check className="h-3 w-3 xs:h-4 xs:w-4" />
                      </div>
                      {point}
                    </motion.li>
                  )
                )}
              </ul>

              <div className="flex flex-row items-center gap-4 sm:gap-6">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="w-1/2"
                >
                  <Button
                    onClick={handleBuyNow}
                    className="bg-gradient-to-r from-[#e84118] to-[#e74c3c] hover:from-[#d63010] hover:to-[#c0392b] text-white rounded-full px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-bold w-full shadow-lg hover:shadow-xl transition-all duration-300 action-button relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                      BUY NOW
                    </span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  </Button>
                </motion.div>

                <div className="flex gap-4 sm:gap-6 w-1/2 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src={extraBadge1Src || "/placeholder.svg"}
                      alt="Certification Badge 1"
                      width={50}
                      height={50}
                      className="drop-shadow-md sm:w-[60px] sm:h-[60px]"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src={extraBadge2Src || "/placeholder.svg"}
                      alt="Certification Badge 2"
                      width={50}
                      height={50}
                      className="drop-shadow-md sm:w-[60px] sm:h-[60px]"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 bg-[#1d4e5f] text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} {product.new_name}. All Rights
            Reserved.
          </p>
          {product.total_clicks > 0 && (
            <p className="text-xs mt-1 text-white/70">
              {product.total_clicks}+ views
            </p>
          )}
        </div>
      </footer>
    </main>
  );
}
