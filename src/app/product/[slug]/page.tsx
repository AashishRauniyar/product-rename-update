// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { useRouter, useParams } from "next/navigation";
// import axios from "axios";
// import bgImageSrc from "@/Image/bg.png";
// import bgDarkImageSrc from "@/Image/bg-dark.png";

// // Define TypeScript interface for our product data
// interface ProductData {
//   id: string;
//   old_name: string;
//   new_name: string;
//   description: string;
//   description_points: string[];
//   rename_reason: string;
//   old_images: string[];
//   new_images: string[];
//   badge_image_url: string | null;
//   extra_badge_1: string | null;
//   extra_badge_2: string | null;
//   next_redirect_url: string;
//   redirect_timer: number;
//   theme: string;
//   generated_link: string;
//   page_title: string;

//   total_clicks: number;
// }

// export default function ProductRebrandContent() {
//   // State variables
//   const [timeLeft, setTimeLeft] = useState(10);
//   const secondSectionRef = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const [product, setProduct] = useState<ProductData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Router and params
//   const router = useRouter();
//   const params = useParams();
//   const slug = params?.slug as string;

//   // Fetch product data
//   useEffect(() => {
//     if (!slug) return;

//     const fetchProduct = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         // Extract product ID from slug
//         const idMatch = slug.match(
//           /-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
//         );
//         const productId = idMatch ? idMatch[1] : slug;

//         // Log the extraction for debugging
//         console.log(`Extracting product ID from slug: ${slug} -> ${productId}`);

//         // Make API request
//         const response = await axios.get(`/api/product/${productId}`);

//         // Check response status
//         if (response.status !== 200) {
//           throw new Error(`API returned status code ${response.status}`);
//         }

//         const productData = response.data;
//         console.log(`Fetched product data:`, productData);

//         if (!productData) {
//           throw new Error("Product not found or empty response");
//         }

//         // Process the product data - handle potential JSON strings
//         const processedProduct = {
//           ...productData,
//           old_images: Array.isArray(productData.old_images)
//             ? productData.old_images
//             : JSON.parse(productData.old_images || "[]"),
//           new_images: Array.isArray(productData.new_images)
//             ? productData.new_images
//             : JSON.parse(productData.new_images || "[]"),
//           description_points: Array.isArray(productData.description_points)
//             ? productData.description_points
//             : JSON.parse(productData.description_points || "[]"),
//         };

//         console.log("Successfully fetched product data:", processedProduct.id);

//         // Track page view by making a request to the visit tracking endpoint
//         try {
//           await axios.post(`/api/analytics/visit`, {
//             productId: processedProduct.id,
//           });
//         } catch (visitError) {
//           console.warn("Failed to track visit:", visitError);
//         }

//         setProduct(processedProduct);
//         setTimeLeft(processedProduct.redirect_timer || 7);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching product:", error);

//         // Set specific error message
//         if (axios.isAxiosError(error)) {
//           if (error.response?.status === 404) {
//             setError("Product not found");
//           } else {
//             setError(`API error: ${error.message}`);
//           }
//         } else {
//           setError(
//             `Unexpected error: ${
//               error instanceof Error ? error.message : String(error)
//             }`
//           );
//         }

//         setIsLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   // Timer countdown effect
//   useEffect(() => {
//     if (timeLeft <= 0 || !product?.next_redirect_url) return;

//     const timer = setTimeout(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           // Redirect when timer reaches zero
//           if (product.next_redirect_url) {
//             handleBuyNow();
//           }
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeLeft, product]);

//   // Animation visibility effect
//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   // Scroll to second section function
//   const scrollToSecondSection = () => {
//     secondSectionRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Handle buy now button click
//   const handleBuyNow = () => {
//     if (product?.next_redirect_url) {
//       if (product.next_redirect_url.startsWith("#")) {
//         // If it's a hash link, scroll to that section
//         const element = document.querySelector(product.next_redirect_url);
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       } else {
//         // Otherwise navigate to the URL
//         router.push(product.next_redirect_url);
//       }
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <main className="min-h-screen bg-[#e2f5fb] dark:bg-[#17414f] flex justify-center items-center">
//         <div className="flex flex-col items-center gap-6">
//           <div className="relative w-20 h-20">
//             <div className="absolute top-0 left-0 w-full h-full border-4 border-[#17414f]/30 dark:border-[#41bae3]/30 rounded-full"></div>
//             <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#17414f] dark:border-t-[#41bae3] rounded-full animate-spin"></div>
//           </div>
//           <p className="text-[#17414f] dark:text-white animate-pulse text-xl font-medium">
//             Loading product information...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   // Error state
//   if (error || !product) {
//     return (
//       <main className="min-h-screen bg-[#e2f5fb] dark:bg-[#17414f] flex justify-center items-center">
//         <div className="bg-white dark:bg-[#1a2e35] p-8 rounded-lg shadow-lg max-w-md">
//           <h2 className="text-2xl font-bold text-[#17414f] dark:text-white mb-4">
//             Product Not Found
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             {error ||
//               "The requested product could not be found. Please check the URL and try again."}
//           </p>
//           <Button
//             className="bg-[#17414f] hover:bg-[#0f2a33] dark:bg-[#41bae3] dark:hover:bg-[#3da4c7] text-white"
//             onClick={() => router.push("/")}
//           >
//             Return to Home
//           </Button>
//         </div>
//       </main>
//     );
//   }

//   // Get image sources with fallbacks
//   const oldImageSrc =
//     product.old_images && product.old_images.length > 0
//       ? product.old_images[0]
//       : "/placeholder.svg?text=Old+Product";

//   const newImageSrc =
//     product.new_images && product.new_images.length > 0
//       ? product.new_images[0]
//       : "/placeholder.svg?text=New+Product";

//   // Get badge image sources with fallbacks
//   const badgeImageSrc =
//     product.badge_image_url || "/placeholder.svg?text=Guarantee";
//   const extraBadge1Src =
//     product.extra_badge_1 || "/placeholder.svg?text=Badge+1";
//   const extraBadge2Src =
//     product.extra_badge_2 || "/placeholder.svg?text=Badge+2";

//   return (
//     <main
//       className={`min-h-screen overflow-hidden text-center relative ${
//         product.theme === "dark"
//           ? "bg-[#17414f] text-white"
//           : "bg-[#e2f5fb] text-[#17414f]"
//       }`}
//     >
//       {/* First Section */}
//       <section className="relative z-10 flex flex-col items-center justify-center px-4 py-20 md:py-4 lg:py-8">
//         {/* Timer */}
//         {timeLeft > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mb-4 px-6 py-2 bg-[#c9351b] text-white font-bold rounded-full shadow-lg"
//           >
//             <span>
//               Redirecting to the Secured Product Page in {timeLeft} sec
//             </span>
//           </motion.div>
//         )}

//         {/* Heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.2 }}
//           className="text-center mb-8 max-w-4xl"
//         >
//           <h1 className="text-2xl sm:text-3xl md:text-4xl  mb-4">
//             <span className="text font-bold">
//               {product.old_name.toUpperCase()}
//             </span>{" "}
//             <span className="text font-medium">HAS BEEN RENAMED TO</span>{" "}
//             <span className="text font-bold">
//               {product.new_name.toUpperCase()}
//             </span>
//           </h1>
//           <p className="text-xl sm:text-2xl text font-medium">
//             DUE TO COUNTERFEIT ISSUES
//           </p>
//         </motion.div>

//         {/* Product Comparison - Improved for mobile and large screens */}
//         <div className="flex flex-row items-center justify-between gap-4 xs:gap-6 sm:gap-8 md:gap-16 lg:gap-24 w-full max-w-7xl mx-auto mb-8 relative xs:relative">
//           {/* Old Product */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="flex flex-col items-center z-10 w-1/3 xs:w-2/5"
//           >
//             <div className="relative w-full max-w-[250px]">
//               <Image
//                 src={oldImageSrc || "/placeholder.svg"}
//                 alt={`${product.old_name} bottle`}
//                 width={200}
//                 height={250}
//                 unoptimized
//                 style={{ objectFit: "contain" }}
//                 className="p-2 md:ml-5   "
//               />
//             </div>
//             <span className="text font-bold text-xl xs:text-lg sm:text-2xl sm:font-bold md:text-3xl text-center mt-2 xs:mt-4">
//               {product.old_name}
//             </span>
//           </motion.div>

//           {/* Arrow */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.8 }}
//             className="flex justify-center items-center z-10 absolute left-1/2 transform -translate-x-1/2 xs:static xs:transform-none"
//           >
//             <motion.div
//               className="relative  p-1 xs:p-2 sm:p-3 "
//               animate={{
//                 x: [0, 10, 0],
//                 scale: [1, 1.1, 1],
//               }}
//               transition={{
//                 repeat: Number.POSITIVE_INFINITY,
//                 duration: 1.5,
//                 ease: "easeInOut",
//               }}
//             >
//               <svg
//                 width="137"
//                 height="76"
//                 viewBox="0 0 137 76"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-18 h-12 xs:w-12 xs:h-12 sm:w-12 sm:h-8 md:w-96 md:h-24"
//               >
//                 <path
//                   d="M136.12 37.9008L80.7866 0V20.2137H37.6266V55.5878H80.7866V75.8015L136.12 37.9008Z"
//                   fill="#187D9F"
//                 />
//                 <path
//                   d="M18.8134 20.2137H29.88V55.5878H18.8134V20.2137Z"
//                   fill="#187D9F"
//                 />
//                 <path
//                   d="M0 20.2137H11.0667V55.5878H0V20.2137Z"
//                   fill="#187D9F"
//                 />
//               </svg>
//             </motion.div>
//           </motion.div>

//           {/* New Product */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 1 }}
//             className="flex flex-col items-center z-10 w-1/3 xs:w-2/5"
//           >
//             <motion.div
//               className="relative w-full max-w-[250px] "
//               animate={{ y: [0, -10, 0] }}
//               transition={{
//                 repeat: Number.POSITIVE_INFINITY,
//                 duration: 2,
//                 ease: "easeInOut",
//               }}
//             >
//               <Image
//                 src={newImageSrc || "/placeholder.svg"}
//                 alt={`${product.new_name} bottle`}
//                 width={200}
//                 height={250}
//                 unoptimized
//                 style={{ objectFit: "contain" }}
//                 className="p-2 md:ml-5  "
//               />
//               <div className="absolute -top-2 -right-2 xs:-top-4 xs:-right-4 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 animate-pulse">
//                 <Image
//                   src={badgeImageSrc || "/placeholder.svg"}
//                   alt="Money Back Guarantee"
//                   width={100}
//                   height={100}
//                   unoptimized
//                   className="drop-shadow-lg"
//                 />
//               </div>
//             </motion.div>
//             <span className="text font-bold text-xl xs:text-lg sm:text-xl md:text-3xl sm:font-bold text-center xs:mt-4 animate-[blink_4s_ease-in-out_infinite]">
//               {product.new_name}
//             </span>
//           </motion.div>
//         </div>

//         {/* Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 1.2 }}
//           className="flex flex-row gap-4 justify-center mt-6  w-full max-w-md mx-auto px-4"
//         >
//           <Button
//             onClick={scrollToSecondSection}
//             variant="outline"
//             className="bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-[#1a2e35] text-[#17414f] dark:text-white border-[#17414f] dark:border-white rounded-full px-4 xs:px-6 py-4 xs:py-6 text-xs xs:text-sm sm:text-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 w-1/2 h-full"
//           >
//             LEARN MORE
//           </Button>

//           <Button
//             onClick={handleBuyNow}
//             className="bg-[#007197] hover:bg-[#0f2a33] dark:bg-[#41bae3] dark:hover:bg-[#3da4c7] text-white rounded-full px-4 xs:px-6 py-4 xs:py-6 text-xs xs:text-sm sm:text-xl font-bold  shadow-md hover:shadow-lg transition-all duration-300 w-1/2 h-full"
//           >
//             <ShoppingCart className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />{" "}
//             BUY NOW
//           </Button>
//         </motion.div>
//       </section>

//       {/* Second Section */}
//       <section
//         ref={secondSectionRef}
//         id="buy-now"
//         className={`relative z-10 py-16 md:py-24 ${
//           product.theme === "dark"
//             ? "bg-[#17414F] text-white"
//             : "bg-[#e2f5fb] text-[#17414f]"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 lg:px-8">
//           <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24">
//             {/* Product Image */}
//             <div className="md:w-1/2 flex justify-center">
//               <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//                 viewport={{ once: true }}
//                 className="relative"
//               >
//                 <Image
//                   src={
//                     product.theme === "dark"
//                       ? bgDarkImageSrc
//                       : bgImageSrc || "/placeholder.svg"
//                   }
//                   alt={`${product.old_name} bottle`}
//                   width={450}
//                   height={500}
//                   unoptimized
//                   style={{ objectFit: "contain" }}
//                   className="absolute drop-shadow-xl w-[250px] h-[300px] sm:w-[500px] sm:h-[500px] object-cover rounded-lg md:ml-56 opacity-50"
//                 />

//                 <motion.div
//                   className="relative w-64 h-80  sm:w-3xl sm:h-96 md:ml-50"
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{
//                     repeat: Number.POSITIVE_INFINITY,
//                     duration: 3,
//                     ease: "easeInOut",
//                   }}
//                 >
//                   <Image
//                     src={newImageSrc || "/placeholder.svg"}
//                     alt={`${product.new_name.toUpperCase()} bottle`}
//                     width={250}
//                     height={300}
//                     style={{ objectFit: "contain" }}
//                     className="drop-shadow-xl w-[200px] h-[300px] sm:w-[400px] sm:h-[500px] object-cover rounded-lg "
//                   />
//                 </motion.div>
//                 <div className="absolute -top-4 ml-32 md:ml-[450px] w-24 h-24 animate-pulse">
//                   <Image
//                     src={badgeImageSrc || "/placeholder.svg"}
//                     alt="Money Back Guarantee"
//                     width={150}
//                     height={150}
//                     priority
//                     unoptimized
//                     className="drop-shadow-lg"
//                   />
//                 </div>
//               </motion.div>
//             </div>

//             {/* Product Details */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               viewport={{ once: true }}
//               className="md:w-1/2 text-left"
//             >
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text mb-6">
//                 {product.new_name.toUpperCase()}{" "}
//               </h2>

//               <p className="text mb-6 text-lg">{product.description}</p>

//               <ul className="space-y-4 mb-8">
//                 {product.description_points.map((point, index) => (
//                   <motion.li
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
//                     viewport={{ once: true }}
//                     className={`flex items-start text-lg ${
//                       product.theme === "dark"
//                         ? "text-gray-200"
//                         : "text-[#17414f]"
//                     }`}
//                   >
//                     <div
//                       className={`mr-3 mt-1 ${
//                         product.theme === "dark"
//                           ? "text-[#41bae3]"
//                           : "text-[#17414f]"
//                       }`}
//                     >
//                       •
//                     </div>
//                     {point}
//                   </motion.li>
//                 ))}
//               </ul>

//               <div className="flex flex-row items-center gap-6">
//                 <Button
//                   onClick={handleBuyNow}
//                   className="bg-[#007197] hover:bg-[#0f2a33] dark:bg-[#41bae3] dark:hover:bg-[#3da4c7] text-white rounded-full px-8 py-7 text-2xl font-bold w-1/2 shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <ShoppingCart className=" h-6 w-6 font-bold" /> BUY NOW
//                 </Button>

//                 <div className="flex gap-6">
//                   {product.extra_badge_1 && (
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 400,
//                         damping: 10,
//                       }}
//                     >
//                       <Image
//                         src={extraBadge1Src || "/placeholder.svg"}
//                         alt="Certification Badge 1"
//                         width={60}
//                         height={60}
//                         className="drop-shadow-md"
//                       />
//                     </motion.div>
//                   )}
//                   {product.extra_badge_2 && (
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 400,
//                         damping: 10,
//                       }}
//                     >
//                       <Image
//                         src={extraBadge2Src || "/placeholder.svg"}
//                         alt="Certification Badge 2"
//                         width={60}
//                         height={60}
//                         className="drop-shadow-md"
//                       />
//                     </motion.div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer
//         className={`relative z-10 py-6 ${
//           product.theme === "dark" ? "bg-[#0f2a33]" : "bg-[#17414f]"
//         } text-white text-center`}
//       >
//         <div className="max-w-6xl mx-auto px-4">
//           <p className="text-sm">
//             © {new Date().getFullYear()} {product.new_name}. All Rights
//             Reserved.
//           </p>
//           {product.total_clicks > 0 && (
//             <p className="text-xs mt-1 text-white/70">
//               {product.total_clicks}+ views
//             </p>
//           )}
//         </div>
//       </footer>
//     </main>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import bgImageSrc from "@/Image/bg.png";
import bgDarkImageSrc from "@/Image/bg-dark.png";
import { Skeleton } from "@/components/ui/skeleton";

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
  category_name: string | null;
  category_id: string | null;
  total_clicks: number;
}

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

  // Loading state with Skeletons
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#e2f5fb] dark:bg-[#17414f] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-4xl animate-pulse">
          {/* Skeleton for Timer */}
          <Skeleton className="h-10 w-72 md:w-96 mx-auto rounded-full mb-12" />

          {/* Skeleton for Heading */}
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mx-auto mb-3" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-5" />
            <Skeleton className="h-7 w-2/3 mx-auto" />
          </div>

          {/* Skeleton for Product Comparison */}
          <div className="flex flex-row items-start justify-between gap-4 xs:gap-6 sm:gap-8 md:gap-16 lg:gap-24 w-full max-w-5xl mx-auto mb-12">
            {/* Old Product Skeleton */}
            <div className="flex flex-col items-center w-1/3 xs:w-2/5">
              <Skeleton className="w-full max-w-[150px] h-[200px] sm:max-w-[200px] sm:h-[250px] mb-3" />
              <Skeleton className="h-6 w-3/4" />
            </div>

            {/* Arrow Skeleton */}
            <div className="flex justify-center items-center pt-16">
              <Skeleton className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>

            {/* New Product Skeleton */}
            <div className="flex flex-col items-center w-1/3 xs:w-2/5">
              <div className="relative w-full max-w-[150px] sm:max-w-[200px]">
                <Skeleton className="w-full h-[200px] sm:h-[250px] mb-3" />
                <Skeleton className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full" />{" "}
                {/* Badge */}
              </div>
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>

          {/* Skeleton for Buttons */}
          <div className="flex flex-row gap-4 justify-center mt-10 w-full max-w-md mx-auto px-4">
            <Skeleton className="h-12 sm:h-16 w-1/2 rounded-full" />
            <Skeleton className="h-12 sm:h-16 w-1/2 rounded-full" />
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#e2f5fb] dark:bg-[#17414f] flex justify-center items-center">
        <div className="bg-white dark:bg-[#1a2e35] p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-[#17414f] dark:text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error ||
              "The requested product could not be found. Please check the URL and try again."}
          </p>
          <Button
            className="bg-[#17414f] hover:bg-[#0f2a33] dark:bg-[#41bae3] dark:hover:bg-[#3da4c7] text-white"
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
    <main
      className={`min-h-screen overflow-hidden text-center relative ${
        product.theme === "dark"
          ? "bg-[#17414f] text-white"
          : "bg-[#e2f5fb] text-[#17414f]"
      }`}
    >
      {/* First Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-20 md:py-4 lg:py-8">
        {/* Timer */}
        {timeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 px-6 py-2 bg-[#c9351b] text-white font-bold rounded-full shadow-lg"
          >
            <span>
              Redirecting to the Secured Product Page in {timeLeft} sec
            </span>
          </motion.div>
        )}

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-8 max-w-4xl"
        >
          {/* Category Badge */}
          {product.category_name && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4"
            >
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                product.theme === "dark" 
                  ? "bg-[#41bae3]/20 text-[#41bae3] border border-[#41bae3]/30" 
                  : "bg-[#17414f]/10 text-[#17414f] border border-[#17414f]/30"
              }`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {product.category_name}
              </span>
            </motion.div>
          )}
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl  mb-4">
            <span className="text font-bold">
              {product.old_name.toUpperCase()}
            </span>{" "}
            <span className="text font-medium">HAS BEEN RENAMED TO</span>{" "}
            <span className="text font-bold">
              {product.new_name.toUpperCase()}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text font-medium">
            DUE TO COUNTERFEIT ISSUES
          </p>
        </motion.div>

        {/* Product Comparison - Improved for mobile and large screens */}
        <div className="flex flex-row items-center justify-between gap-4 xs:gap-6 sm:gap-8 md:gap-16 lg:gap-24 w-full max-w-7xl mx-auto mb-8 relative xs:relative">
          {/* Old Product */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center z-10 w-1/3 xs:w-2/5"
          >
            <div className="relative w-full max-w-[250px]">
              <Image
                src={oldImageSrc || "/placeholder.svg"}
                alt={`${product.old_name} bottle`}
                width={200}
                height={250}
                unoptimized
                style={{ objectFit: "contain" }}
                className="p-2 md:ml-5   "
              />
            </div>
            <span className="text font-bold text-xl xs:text-lg sm:text-2xl sm:font-bold md:text-3xl text-center mt-2 xs:mt-4">
              {product.old_name}
            </span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center items-center z-10 absolute left-1/2 transform -translate-x-1/2 xs:static xs:transform-none"
          >
            <motion.div
              className="relative  p-1 xs:p-2 sm:p-3 "
              animate={{
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <svg
                width="137"
                height="76"
                viewBox="0 0 137 76"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-18 h-12 xs:w-12 xs:h-12 sm:w-12 sm:h-8 md:w-96 md:h-24"
              >
                <path
                  d="M136.12 37.9008L80.7866 0V20.2137H37.6266V55.5878H80.7866V75.8015L136.12 37.9008Z"
                  fill="#187D9F"
                />
                <path
                  d="M18.8134 20.2137H29.88V55.5878H18.8134V20.2137Z"
                  fill="#187D9F"
                />
                <path
                  d="M0 20.2137H11.0667V55.5878H0V20.2137Z"
                  fill="#187D9F"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* New Product */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col items-center z-10 w-1/3 xs:w-2/5"
          >
            <motion.div
              className="relative w-full max-w-[250px] "
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Image
                src={newImageSrc || "/placeholder.svg"}
                alt={`${product.new_name} bottle`}
                width={200}
                height={250}
                unoptimized
                style={{ objectFit: "contain" }}
                className="p-2 md:ml-5  "
              />
              <div className="absolute -top-2 -right-2 xs:-top-4 xs:-right-4 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 animate-pulse">
                <Image
                  src={badgeImageSrc || "/placeholder.svg"}
                  alt="Money Back Guarantee"
                  width={100}
                  height={100}
                  unoptimized
                  className="drop-shadow-lg"
                />
              </div>
            </motion.div>
            <span className="text font-bold text-xl xs:text-lg sm:text-xl md:text-3xl sm:font-bold text-center xs:mt-4 animate-[blink_4s_ease-in-out_infinite]">
              {product.new_name}
            </span>
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-row gap-4 justify-center mt-6  w-full max-w-md mx-auto px-4"
        >
          <Button
            onClick={scrollToSecondSection}
            variant="outline"
            className="bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-[#1a2e35] text-[#17414f] dark:text-white border-[#17414f] dark:border-white rounded-full px-4 xs:px-6 py-4 xs:py-6 text-xs xs:text-sm sm:text-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 w-1/2 h-full"
          >
            LEARN MORE
          </Button>

          <Button
            onClick={handleBuyNow}
            className="bg-[#007197] hover:bg-[#0f2a33] dark:bg-[#41bae3] dark:hover:bg-[#3da4c7] text-white rounded-full px-4 xs:px-6 py-4 xs:py-6 text-xs xs:text-sm sm:text-xl font-bold  shadow-md hover:shadow-lg transition-all duration-300 w-1/2 h-full"
          >
            <ShoppingCart className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />{" "}
            BUY NOW
          </Button>
        </motion.div>
      </section>

      {/* Second Section */}
      <section
        ref={secondSectionRef}
        id="buy-now"
        className={`relative z-10 py-16 md:py-24 ${
          product.theme === "dark"
            ? "bg-[#17414F] text-white"
            : "bg-[#e2f5fb] text-[#17414f]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24">
            {/* Product Image */}
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Image
                  src={
                    product.theme === "dark"
                      ? bgDarkImageSrc
                      : bgImageSrc || "/placeholder.svg"
                  }
                  alt={`${product.old_name} bottle`}
                  width={450}
                  height={500}
                  unoptimized
                  style={{ objectFit: "contain" }}
                  className="absolute drop-shadow-xl w-[250px] h-[300px] sm:w-[500px] sm:h-[500px] object-cover rounded-lg md:ml-56 opacity-50"
                />

                <motion.div
                  className="relative w-64 h-80  sm:w-3xl sm:h-96 md:ml-50"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={newImageSrc || "/placeholder.svg"}
                    alt={`${product.new_name.toUpperCase()} bottle`}
                    width={250}
                    height={300}
                    style={{ objectFit: "contain" }}
                    className="drop-shadow-xl w-[200px] h-[300px] sm:w-[400px] sm:h-[500px] object-cover rounded-lg "
                  />
                </motion.div>
                <div className="absolute -top-4 ml-32 md:ml-[450px] w-24 h-24 animate-pulse">
                  <Image
                    src={badgeImageSrc || "/placeholder.svg"}
                    alt="Money Back Guarantee"
                    width={150}
                    height={150}
                    priority
                    unoptimized
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
              className="md:w-1/2 text-left"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text mb-6">
                {product.new_name.toUpperCase()}{" "}
              </h2>

              {/* Category Display */}
              {product.category_name && (
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.theme === "dark" 
                      ? "bg-[#41bae3]/20 text-[#41bae3] border border-[#41bae3]/30" 
                      : "bg-[#17414f]/10 text-[#17414f] border border-[#17414f]/30"
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {product.category_name}
                  </span>
                </div>
              )}

              <p className="text mb-6 text-lg">{product.description}</p>

              <ul className="space-y-4 mb-8">
                {product.description_points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-start text-lg ${
                      product.theme === "dark"
                        ? "text-gray-200"
                        : "text-[#17414f]"
                    }`}
                  >
                    <div
                      className={`mr-3 mt-1 ${
                        product.theme === "dark"
                          ? "text-[#41bae3]"
                          : "text-[#17414f]"
                      }`}
                    >
                      •
                    </div>
                    {point}
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-row items-center gap-6">
                <Button
                  onClick={handleBuyNow}
                  className="bg-[#007197] hover:bg-[#0f2a33] dark:bg-[#41bae3] dark:hover:bg-[#3da4c7] text-white rounded-full px-8 py-7 text-2xl font-bold w-1/2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className=" h-6 w-6 font-bold" /> BUY NOW
                </Button>

                <div className="flex gap-6">
                  {product.extra_badge_1 && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Image
                        src={extraBadge1Src || "/placeholder.svg"}
                        alt="Certification Badge 1"
                        width={60}
                        height={60}
                        className="drop-shadow-md"
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
                      <Image
                        src={extraBadge2Src || "/placeholder.svg"}
                        alt="Certification Badge 2"
                        width={60}
                        height={60}
                        className="drop-shadow-md"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 py-6 ${
          product.theme === "dark" ? "bg-[#0f2a33]" : "bg-[#17414f]"
        } text-white text-center`}
      >
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
