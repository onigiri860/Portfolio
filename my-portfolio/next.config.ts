import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ★重要: これがないと out フォルダが作られません
  output: 'export',
  
  // ★重要: GitHub Pagesでは画像の最適化ができないためOFFにする
  images: { unoptimized: true },

  // ★重要: リポジトリ名に合わせてパスを調整
  basePath: '/Portfolio',
  assetPrefix: '/Portfolio/',
};

export default nextConfig;