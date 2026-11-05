import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in a parent folder (D:\videos) makes Next guess the wrong root.
  outputFileTracingRoot: path.join(__dirname),
  webpack(config) {
    // The project lives on an exFAT drive, where readlink() throws EISDIR instead of EINVAL.
    // Skipping symlink resolution avoids that (the project uses no symlinks).
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
