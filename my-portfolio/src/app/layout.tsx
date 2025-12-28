import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Noto_Sans_JP } from 'next/font/google';

// フォントの設定
const inter = Inter({ subsets: ['latin'] });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '700'] });

// ★ここを編集
export const metadata: Metadata = {
  title: 'onigiri860\'s Portfolio',
  description: 'onigiri860のポートフォリオサイト',
  // OGP設定 (SNSでシェアされた時の表示)
  openGraph: {
    title: 'onigiri860\'s Portfolio',
    description: 'onigiri860のポートフォリオサイト',
    url: 'https://onigiri860.github.io/Portfolio/', // 実際のデプロイ先URL
    siteName: 'onigiri860 Portfolio',
    images: [
      {
        url: '/Portfolio/images/onigiri860.jpg', // シェア用画像のパス
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'onigiri860\'s Portfolio',
    description: 'onigiri860のポートフォリオサイト',
    images: ['/Portfolio/images/onigiri860.jpg'], // シェア用画像のパス
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      {/* フォントクラスをbodyに適用 */}
      <body className={`${inter.className} ${notoSansJP.className} bg-gray-50 text-gray-800`}>
        {children}
      </body>
    </html>
  );
}