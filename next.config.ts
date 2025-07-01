import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'productrename.vercel.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'healthpaysecure.us',
      },
      {
        protocol: 'https',
        hostname: 'www.healthpaysecure.us',
      },
    ],
  },
};

export default nextConfig;
