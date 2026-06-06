import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@midpack/ui", "@midpack/auth", "@midpack/api-client"],
  allowedDevOrigins: ["*.local.midpack.io", "local.midpack.io", "*.localhost", "localhost"],
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
