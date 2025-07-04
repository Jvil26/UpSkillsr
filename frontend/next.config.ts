import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["skillsswap-bucket.s3.amazonaws.com"],
  },
};

export default nextConfig;
