import React from 'react';
import Image from 'next/image';

const favoritePlayers = [
  { name: '山本 智大', flag: '🇯🇵' },
  { name: '富田 将馬', flag: '🇯🇵' },
  { name: 'Aleksander Nikolov', flag: '🇧🇬' }
];

export default function Volleyball() {
  return (
    // 外側の大きな枠（セクション）は維持して統一感を保つ
    <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
      
      <h3 className="text-2xl font-bold mb-6 text-orange-400 flex items-center gap-2">
        Volleyball
      </h3>
      
      {/* カード(枠)を使わず、シンプルな文章構成に変更 */}
      <div className="space-y-8">
        
        {/* 文章部分 */}
        <div>
          <h4 className="text-xl font-bold text-white mb-3">Passion & Position</h4>
          <p className="text-gray-300 leading-relaxed">
            小中高大と12年以上バレーボールをしてきました <br />
            やるのも好きだし、観るのも好き！ <br /> <br />

            ポジション : リベロ（大学では全部やったよ～） <br /> <br />

            好きな選手 : 山本 智大 🇯🇵、富田 将馬 🇯🇵、Aleksander Nikolov 🇧🇬
          </p>
        </div>

        {/* --- 画像セクション 1 --- */}
        <div>
          {/* ★修正：テキストを <p> タグで囲み、スタイルを適用 */}
          <p className="text-center text-gray-400 mb-2">
            2025/10/24 (ブルテオンvsサントリー) にて撮影
          </p>
          <div className="flex justify-center">
            {/* ★修正：<Image> コンポーネントを使用 */}
            <Image
              src="/Portfolio/images/volleyball_2025_10_24.jpg"
              alt="Volleyball Match 2025_10_24"
              width={800} // ★重要：画像の実際の幅に合わせて変更してください
              height={600} // ★重要：画像の実際の高さに合わせて変更してください
              className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
            />
          </div>
        </div>
        
        {/* --- 画像セクション 2 --- */}
        <div>
          <p className="text-center text-gray-400 mb-2">
            2025/03/09 (サントリーvsブルテオン) にて撮影
          </p>
          <div className="flex justify-center">
            <Image
              src="/Portfolio/images/volleyball_2025_03_09.jpg"
              alt="Volleyball Match 2025_03_09"
              width={800} // ★要調整
              height={600} // ★要調整
              className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
            />
          </div>
        </div>

        {/* --- 画像セクション 3 (ハイキュー!!) --- */}
        <div>
          <p className="text-center text-gray-400 mb-2">
            2025/02/17 仙台市体育館にて撮影
          </p>
          {/* 2枚の画像を並べて表示するためのグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-center">
              <Image
                src="/Portfolio/images/haikyu_1.jpg"
                alt="haikyu_1"
                width={600} // ★要調整
                height={450} // ★要調整
                className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/Portfolio/images/haikyu_2.jpg"
                alt="haikyu_2"
                width={600} // ★要調整
                height={450} // ★要調整
                className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}