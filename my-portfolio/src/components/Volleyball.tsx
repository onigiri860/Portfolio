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

        2025/10/24 (ブルテオンvsサントリー) にて撮影
        <div className="flex justify-center">
          <img
            src="/Portfolio/images/volleyball_2025_10_24.jpg"
            alt="Volleyball Match 2025_10_24"
            className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
          />
        </div>
        
        2025/03/09 (サントリーvsブルテオン) にて撮影
        <div className="flex justify-center">
          <img
            src="/Portfolio/images/volleyball_2025_03_09.jpg"
            alt="Volleyball Match 2025_03_09"
            className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
          />
        </div>

        2025/02/17 仙台市体育館にて撮影
        <div className="flex justify-center">
          <img
            src="/Portfolio/images/haikyu_1.jpg"
            alt="haikyu_1"
            className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
          />
        </div>
        <div className="flex justify-center">
          <img
            src="/Portfolio/images/haikyu_2.jpg"
            alt="haikyu_2"
            className="rounded-lg shadow-lg border border-gray-700 max-w-full h-auto"
          />
        </div>

      </div>
    </section>
  );
}