import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // ▼ この2行が、CSSを正しく読み込むために超重要です
  basePath: '/Portfolio',
  assetPrefix: '/Portfolio/',
};

export default nextConfig;