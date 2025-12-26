/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  
  // ★重要：あなたのリポジトリ名「Portfolio」をここに書く
  // もしリポジトリ名を変えた場合はここも変えてください
  basePath: '/Portfolio',
  assetPrefix: '/Portfolio/',
};

export default nextConfig;