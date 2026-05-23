import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  eslint: {
    dirs: ["app", "components", "lib"],
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  outputFileTracingExcludes: {
    "*": ["./server/**/*"],
  },
};

export default nextConfig;
