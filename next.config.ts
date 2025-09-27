import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // nonaktifkan lightningcss di build Next
  },
};

export default nextConfig;
