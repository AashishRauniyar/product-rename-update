/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

// Import new UI components
import { LoadingSkeleton } from "@/components/product/LoadingSkeleton";
import { CountdownTimer } from "@/components/product/CountdownTimer";
import { ProductComparison } from "@/components/product/ProductComparison";
import { ActionButtons } from "@/components/product/ActionButtons";
import { ProductDetails } from "@/components/product/ProductDetails";
import { StickyBuyButton } from "@/components/product/StickyBuyButton";
import { ScrollToTop } from "@/components/product/ScrollToTop";
import { ProductData } from "@/types/Product";

export default function ProductRebrandContent() {
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
        console.log(`Fetched product data:`, productData);

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

        // Fetch category data if category_id exists
        if (processedProduct.category_id) {
          try {
            const categoryResponse = await axios.get(`/api/categories/${processedProduct.category_id}`);
            if (categoryResponse.data) {
              // Use category description and points instead of product ones
              processedProduct.description = categoryResponse.data.description || processedProduct.description;
              processedProduct.description_points = Array.isArray(categoryResponse.data.description_points)
                ? categoryResponse.data.description_points
                : JSON.parse(categoryResponse.data.description_points || "[]");
            }
          } catch (categoryError) {
            console.warn("Failed to fetch category data:", categoryError);
            // Continue with product data if category fetch fails
          }
        }

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
        setTimeLeft(processedProduct.redirect_timer || 7);
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
    return <LoadingSkeleton />;
  }

  // Error state
  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#17414F] flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-white/80 mb-6">
            {error ||
              "The requested product could not be found. Please check the URL and try again."}
          </p>
          <button
            className="bg-[#00D4FF] hover:bg-[#00B8E6] text-black font-bold px-6 py-3 rounded-full transition-colors duration-300"
            onClick={() => router.push("/")}
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#17414F] text-white relative overflow-hidden">
      {/* First Section - Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
        {/* Timer */}
        {timeLeft > 0 && (
          <CountdownTimer timeLeft={timeLeft} />
        )}

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto"
        >
          {/* Category Badge */}
          {/* {product.category_name && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4 sm:mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {product.category_name}
              </span>
            </motion.div>
          )} */}
          
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-1xl font-black mb-2 sm:mb-6 leading-tight">
            <span className="text-white">
              {product.old_name.toUpperCase()}
            </span>{" "}
            <span className="text-white/80 font-medium block sm:inline">HAS BEEN RENAMED TO</span>{" "}
            <span className="text-[#00D4FF] animate-pulse">
              {product.new_name.toUpperCase()}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
            DUE TO COUNTERFEIT ISSUES
          </p>
        </motion.div>

        {/* Product Comparison */}
        <ProductComparison product={product} />

        {/* Action Buttons */}
        <ActionButtons
          onLearnMore={scrollToSecondSection}
          onBuyNow={handleBuyNow}
        />
      </section>

      {/* Second Section - Product Details */}
      <div ref={secondSectionRef}>
        <ProductDetails
          product={product}
          onBuyNow={handleBuyNow}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 bg-black/50 text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} {product.new_name}. All Rights Reserved.
          </p>
          {product.total_clicks > 0 && (
            <p className="text-xs mt-1 text-white/70">
              {product.total_clicks}+ views
            </p>
          )}
        </div>
      </footer>

      {/* Sticky Buy Button */}
      <StickyBuyButton 
        onBuyNow={handleBuyNow}
        productName={product.new_name}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}
