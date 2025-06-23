/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class", "dark"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        xs: "380px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        sine: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-horizontal": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(3px)" },
        },
        "pulse-vertical": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(3px)" },
        },
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "arrow-slide": {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "30%": { opacity: 1, transform: "translateX(0)" },
          "60%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(10px)" },
        },
        "float-slow": {
          "0%": { transform: "translate(0px, 0px)" },
          "33%": { transform: "translate(10px, -10px)" },
          "66%": { transform: "translate(-10px, 10px)" },
          "100%": { transform: "translate(0px, 0px)" },
        },
        "float-slow-reverse": {
          "0%": { transform: "translate(0px, 0px)" },
          "33%": { transform: "translate(-10px, 10px)" },
          "66%": { transform: "translate(10px, -10px)" },
          "100%": { transform: "translate(0px, 0px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(236, 60, 60, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(236, 60, 60, 0.8)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        blink: {
          "0%, 100%": { color: "inherit" },
          "50%": { color: "rgb(239, 68, 68)" }, // text-red-500
        },
      },
      animation: {
        sine: "sine 2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shine: "shine 3s ease-in-out infinite",
        "pulse-horizontal": "pulse-horizontal 1.5s infinite",
        "pulse-vertical": "pulse-vertical 1.5s infinite",
        "pulse-slow": "pulse-slow 3s infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "arrow-slide": "arrow-slide 2s infinite",
        "float-slow": "float-slow 12s ease-in-out infinite",
        "float-slow-reverse": "float-slow-reverse 12s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        blob: "blob 10s infinite",
        blink: "blink 4s ease-in-out infinite",
      },
      skew: {
        30: "30deg",
      },
      perspective: {
        DEFAULT: "1000px",
      },
      rotate: {
        "y-12": "rotateY(12deg)",
      },
      transitionDelay: {
        "2000": "2000ms",
        "4000": "4000ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
