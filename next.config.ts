import type { NextConfig } from "next";
// import { hostname } from "os";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "cdn.sanity.io",
  //     },
  //   ],
  // },
  images: {
    domains: ["cdn.sanity.io"], // 👈 allow Sanity image URLs
  },
};

export default nextConfig;

// EITHER OF THE ABOVE OR BELOW CAN WORK

// next.config.js

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['cdn.sanity.io'], // 👈 allow Sanity image URLs
//   },
// };

// module.exports = nextConfig;
