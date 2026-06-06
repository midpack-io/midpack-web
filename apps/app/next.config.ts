import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared workspace packages are shipped as raw TS and compiled here.
  transpilePackages: ["@midpack/ui", "@midpack/auth", "@midpack/api-client"],
  // Requests arrive via the dev proxy with a Host like `app.localhost:3000` /
  // `app.local.midpack.io:3000`, not `localhost:3002` — whitelist both families.
  allowedDevOrigins: [
    "*.local.midpack.io",
    "local.midpack.io",
    "*.localhost",
    "localhost",
  ],
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
