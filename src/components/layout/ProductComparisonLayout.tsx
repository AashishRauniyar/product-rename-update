// File: /components/layout/ProductComparisonLayout.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";

interface ProductComparisonLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  theme?: "light" | "dark";
}

export default function ProductComparisonLayout({
  children,
  title = "Product Rename Announcement",
  description = "Learn about our product renaming and the improvements we've made.",
  theme = "light",
}: ProductComparisonLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#1f1f1f";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
    }

    // Cleanup
    return () => {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "";
    };
  }, [theme]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Page Decoration Elements - These add visual interest to the page */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top Right Decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 1 }}
            className={`absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br ${
              theme === "dark"
                ? "from-blue-500 to-purple-600"
                : "from-blue-300 to-purple-400"
            }`}
          />

          {/* Bottom Left Decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr ${
              theme === "dark"
                ? "from-red-500 to-amber-600"
                : "from-red-300 to-amber-400"
            }`}
          />

          {/* Random Subtle Shapes - Visible on desktop only */}
          {!isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute top-1/4 left-10 w-12 h-12 rounded-lg rotate-12 bg-current"
                style={{ color: theme === "dark" ? "#4F46E5" : "#6366F1" }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-current"
                style={{ color: theme === "dark" ? "#F43F5E" : "#FB7185" }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute bottom-1/4 right-20 w-10 h-10 rounded-md rotate-45 bg-current"
                style={{ color: theme === "dark" ? "#10B981" : "#34D399" }}
              />
            </>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-grow relative z-10">{children}</main>
      </div>
    </>
  );
}
