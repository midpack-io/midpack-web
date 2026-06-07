import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@midpack/ui", "@midpack/auth", "@midpack/api-client", "@midpack/product-ui"],
  allowedDevOrigins: ["*.local.midpack.io", "local.midpack.io", "*.localhost", "localhost"],
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
