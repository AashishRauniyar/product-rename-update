// // src/app/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion, useScroll, useTransform } from "framer-motion";
// import {
//   ChevronRight,
//   ShieldCheck,
//   CreditCard,
//   Users,
//   CheckCircle,
//   ArrowRight,
// } from "lucide-react";

// // Components
// import Navbar from "@/components/Header";
// import Footer from "@/components/Footer";
// import TestimonialCard from "@/components/TestimonialCard";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const { scrollYProgress } = useScroll();
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const features = [
//     {
//       id: 1,
//       icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
//       title: "Secure Payments",
//       description:
//         "End-to-end encryption ensures your financial and health information remains private and protected.",
//     },
//     {
//       id: 2,
//       icon: <CreditCard className="w-10 h-10 text-blue-500" />,
//       title: "Flexible Payment Options",
//       description:
//         "Multiple payment methods, installment plans, and financing solutions to fit your needs.",
//     },
//     {
//       id: 3,
//       icon: <Users className="w-10 h-10 text-blue-500" />,
//       title: "Patient-Friendly Portal",
//       description:
//         "Easy-to-use interface that simplifies billing, payments, and tracking healthcare expenses.",
//     },
//   ];

//   const testimonials = [
//     {
//       id: 1,
//       content:
//         "HealthPaySecure transformed how our clinic handles payments. Our collection rates improved by 35% in just three months!",
//       author: "Dr. Sarah Johnson",
//       role: "Medical Director, Pacific Health Group",
//     },
//     {
//       id: 2,
//       content:
//         "As a patient, I love how easy it is to understand my bills and make payments. The payment plans helped me manage a large unexpected expense.",
//       author: "Michael Torres",
//       role: "Patient",
//     },
//     {
//       id: 3,
//       content:
//         "Implementation was smooth and the support team was excellent. Our staff required minimal training to get up and running.",
//       author: "Rebecca Chen",
//       role: "Office Manager, Family Care Clinic",
//     },
//   ];

//   const benefits = [
//     "HIPAA-compliant security measures",
//     "Reduces administrative costs by up to 30%",
//     "24/7 patient access to payment options",
//     "Real-time insurance verification",
//     "Automated payment reminders",
//     "Comprehensive reporting dashboard",
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar */}
//       <Navbar isScrolled={isScrolled} />

//       {/* Hero Section */}
//       <motion.section
//         style={{ opacity, scale }}
//         className="relative h-screen flex items-center overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700"
//       >
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/images/healthcare-hero.jpg"
//             alt="Healthcare professional with patient"
//             fill
//             priority
//             quality={90}
//             className="object-cover opacity-20"
//           />
//         </div>

//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
//           <div className="max-w-3xl">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-4xl md:text-6xl font-extrabold text-white mb-6"
//             >
//               Secure Healthcare Payments Made Simple
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-xl text-blue-100 mb-8"
//             >
//               Streamline your healthcare payments with our HIPAA-compliant
//               platform that benefits both providers and patients.
//             </motion.p>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               <Button className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 text-lg px-8 py-6 rounded-md">
//                 Get Started <ChevronRight className="ml-2 h-5 w-5" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-md"
//               >
//                 Request Demo
//               </Button>
//             </motion.div>
//           </div>
//         </div>

//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ repeat: Infinity, duration: 2 }}
//           >
//             <ChevronRight className="h-10 w-10 text-white opacity-80 rotate-90" />
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Trusted By Section */}
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-center text-gray-400 text-lg mb-8 uppercase tracking-wide font-medium">
//             Trusted by healthcare providers nationwide
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
//             {[1, 2, 3, 4, 5, 6].map((index) => (
//               <div key={index} className="flex justify-center items-center">
//                 <Image
//                   src={`/images/logo-${index}.svg`}
//                   alt={`Partner logo ${index}`}
//                   width={120}
//                   height={60}
//                   className="opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Simplify Healthcare Payments for Everyone
//             </h2>
//             <p className="text-xl text-gray-600">
//               Our comprehensive platform connects providers, patients, and
//               payers in one secure ecosystem.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-10">
//             {features.map((feature) => (
//               <motion.div
//                 key={feature.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: feature.id * 0.1 }}
//                 className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
//               >
//                 <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="bg-blue-700 py-16">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5 }}
//               className="text-center"
//             >
//               <p className="text-4xl md:text-5xl font-bold text-white mb-2">
//                 98%
//               </p>
//               <p className="text-blue-100">Collection Rate</p>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="text-center"
//             >
//               <p className="text-4xl md:text-5xl font-bold text-white mb-2">
//                 30%
//               </p>
//               <p className="text-blue-100">Reduced Admin Time</p>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-center"
//             >
//               <p className="text-4xl md:text-5xl font-bold text-white mb-2">
//                 5M+
//               </p>
//               <p className="text-blue-100">Patients Served</p>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="text-center"
//             >
//               <p className="text-4xl md:text-5xl font-bold text-white mb-2">
//                 $2B+
//               </p>
//               <p className="text-blue-100">Payments Processed</p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               How HealthPaySecure Works
//             </h2>
//             <p className="text-xl text-gray-600">
//               A seamless payment experience from appointment to payment
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="space-y-8">
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5 }}
//                   className="flex gap-4"
//                 >
//                   <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
//                     1
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       Patient Registration
//                     </h3>
//                     <p className="text-gray-600">
//                       Patients easily register and verify insurance information
//                       before appointments.
//                     </p>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: 0.1 }}
//                   className="flex gap-4"
//                 >
//                   <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
//                     2
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       Service Delivery
//                     </h3>
//                     <p className="text-gray-600">
//                       Healthcare services are provided and automatically logged
//                       in the system.
//                     </p>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                   className="flex gap-4"
//                 >
//                   <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
//                     3
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       Billing & Insurance
//                     </h3>
//                     <p className="text-gray-600">
//                       Claims are generated and submitted to insurance with
//                       real-time status tracking.
//                     </p>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                   className="flex gap-4"
//                 >
//                   <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
//                     4
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">
//                       Patient Payment
//                     </h3>
//                     <p className="text-gray-600">
//                       Patients receive clear statements and multiple convenient
//                       payment options.
//                     </p>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7 }}
//               className="rounded-xl overflow-hidden shadow-2xl"
//             >
//               <Image
//                 src="/images/platform-interface.jpg"
//                 alt="HealthPaySecure platform interface"
//                 width={600}
//                 height={450}
//                 className="w-full"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               What Our Users Say
//             </h2>
//             <p className="text-xl text-gray-600">
//               Healthcare providers and patients love our platform
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <TestimonialCard
//                 key={testimonial.id}
//                 content={testimonial.content}
//                 author={testimonial.author}
//                 role={testimonial.role}
//                 delay={index * 0.1}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Benefits Section */}
//       <section className="py-20 bg-blue-800 text-white">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">
//                 Benefits for Healthcare Providers
//               </h2>
//               <p className="text-xl text-blue-100 mb-8">
//                 HealthPaySecure streamlines operations, reduces costs, and
//                 increases collection rates.
//               </p>

//               <div className="space-y-4">
//                 {benefits.map((benefit, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className="flex items-center gap-3"
//                   >
//                     <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
//                     <p className="text-blue-50">{benefit}</p>
//                   </motion.div>
//                 ))}
//               </div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//                 className="mt-10"
//               >
//                 <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-6 py-3 rounded-md">
//                   Schedule a Consultation
//                 </Button>
//               </motion.div>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7 }}
//               className="relative"
//             >
//               <div className="absolute -top-4 -left-4 w-full h-full bg-blue-500 rounded-xl"></div>
//               <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-600 rounded-xl"></div>
//               <div className="relative bg-white p-6 rounded-xl shadow-xl">
//                 <Image
//                   src="/images/healthcare-dashboard.jpg"
//                   alt="HealthPaySecure dashboard"
//                   width={600}
//                   height={400}
//                   className="w-full rounded-lg"
//                 />
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5 }}
//               className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
//             >
//               Ready to Transform Your Healthcare Payments?
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="text-xl text-gray-600 mb-8"
//             >
//               Join thousands of healthcare providers who trust HealthPaySecure
//               with their payment processing.
//             </motion.p>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center"
//             >
//               <Button className="bg-blue-700 hover:bg-blue-800 text-white text-lg px-8 py-4 rounded-md">
//                 Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="border-blue-700 text-blue-700 hover:bg-blue-50 text-lg px-8 py-4 rounded-md"
//               >
//                 Contact Sales
//               </Button>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Components
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      id: 1,
      icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
      title: "Secure Payments",
      description:
        "End-to-end encryption ensures your financial and health information remains private and protected.",
    },
    {
      id: 2,
      icon: <CreditCard className="w-10 h-10 text-blue-500" />,
      title: "Flexible Payment Options",
      description:
        "Multiple payment methods, installment plans, and financing solutions to fit your needs.",
    },
    {
      id: 3,
      icon: <Users className="w-10 h-10 text-blue-500" />,
      title: "Patient-Friendly Portal",
      description:
        "Easy-to-use interface that simplifies billing, payments, and tracking healthcare expenses.",
    },
  ];

  const testimonials = [
    {
      id: 1,
      content:
        "HealthPaySecure transformed how our clinic handles payments. Our collection rates improved by 35% in just three months!",
      author: "Dr. Sarah Johnson",
      role: "Medical Director, Pacific Health Group",
    },
    {
      id: 2,
      content:
        "As a patient, I love how easy it is to understand my bills and make payments. The payment plans helped me manage a large unexpected expense.",
      author: "Michael Torres",
      role: "Patient",
    },
    {
      id: 3,
      content:
        "Implementation was smooth and the support team was excellent. Our staff required minimal training to get up and running.",
      author: "Rebecca Chen",
      role: "Office Manager, Family Care Clinic",
    },
  ];

  const benefits = [
    "HIPAA-compliant security measures",
    "Reduces administrative costs by up to 30%",
    "24/7 patient access to payment options",
    "Real-time insurance verification",
    "Automated payment reminders",
    "Comprehensive reporting dashboard",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative h-screen flex items-center overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/healthcare-hero.jpg"
            alt="Healthcare professional with patient"
            fill
            priority
            quality={90}
            unoptimized

            className="object-cover opacity-20"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            >
              Secure Healthcare Payments Made Simple
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 mb-8"
            >
              Streamline your healthcare payments with our HIPAA-compliant
              platform that benefits both providers and patients.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 text-lg px-8 py-6 rounded-md">
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-md"
              >
                Request Demo
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            <ChevronRight className="h-10 w-10 text-white opacity-80 rotate-90" />
          </motion.div>
        </div>
      </motion.section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-400 text-lg mb-8 uppercase tracking-wide font-medium">
            Trusted by healthcare providers nationwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="flex justify-center items-center">
                <Image
                  src={`/images/logo-${index}.png`}
                  alt={`Partner logo ${index}`}
                  width={120}
                  height={60}
                  unoptimized

                  className="opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simplify Healthcare Payments for Everyone
            </h2>
            <p className="text-xl text-gray-600">
              Our comprehensive platform connects providers, patients, and
              payers in one secure ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.id * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-700 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                98%
              </p>
              <p className="text-blue-100">Collection Rate</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                30%
              </p>
              <p className="text-blue-100">Reduced Admin Time</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                5M+
              </p>
              <p className="text-blue-100">Patients Served</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                $2B+
              </p>
              <p className="text-blue-100">Payments Processed</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How HealthPaySecure Works
            </h2>
            <p className="text-xl text-gray-600">
              A seamless payment experience from appointment to payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Patient Registration
                    </h3>
                    <p className="text-gray-600">
                      Patients easily register and verify insurance information
                      before appointments.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex gap-4"
                >
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Service Delivery
                    </h3>
                    <p className="text-gray-600">
                      Healthcare services are provided and automatically logged
                      in the system.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex gap-4"
                >
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Billing & Insurance
                    </h3>
                    <p className="text-gray-600">
                      Claims are generated and submitted to insurance with
                      real-time status tracking.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Patient Payment
                    </h3>
                    <p className="text-gray-600">
                      Patients receive clear statements and multiple convenient
                      payment options.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/platform-interface.jpg"
                alt="HealthPaySecure platform interface"
                width={600}
                height={450}
                unoptimized

                className="w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Healthcare providers and patients love our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Benefits for Healthcare Providers
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                HealthPaySecure streamlines operations, reduces costs, and
                increases collection rates.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <p className="text-blue-50">{benefit}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10"
              >
                <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-6 py-3 rounded-md">
                  Schedule a Consultation
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-full h-full bg-blue-500 rounded-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-600 rounded-xl"></div>
              <div className="relative bg-white p-6 rounded-xl shadow-xl">
                <Image
                  src="/images/healthcare-dashboard.jpg"
                  alt="HealthPaySecure dashboard"
                  width={600}
                  height={400}
                  unoptimized

                  className="w-full rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Ready to Transform Your Healthcare Payments?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              Join thousands of healthcare providers who trust HealthPaySecure
              with their payment processing.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-blue-700 hover:bg-blue-800 text-white text-lg px-8 py-4 rounded-md">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-blue-700 text-blue-700 hover:bg-blue-50 text-lg px-8 py-4 rounded-md"
              >
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
