import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/dev-refeel-chronicle/**",
      },
    ],
  },
};

export default nextConfig;
