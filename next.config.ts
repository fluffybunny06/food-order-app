import type { NextConfig } from "next";
import { env } from "./lib/env";

const imageBaseUrl = new URL(env.s3PublicBaseUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: imageBaseUrl.protocol.replace(":", "") as "http" | "https",
        hostname: imageBaseUrl.hostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
