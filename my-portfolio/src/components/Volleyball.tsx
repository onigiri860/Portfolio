import React from 'react';

const favoritePlayers = [
  { name: '山本 智大', flag: '🇯🇵' },
  { name: '富田 将馬', flag: '🇯🇵' },
  { name: 'Aleksander Nikolov', flag: '🇧🇬' }
];

export default function Volleyball() {
  return (
    <section className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      
      <h3 className="text-2xl font-bold mb-6 text-orange-500 flex items-center gap-2">
        Volleyball
      </h3>
      
      <div className="space-y-12">
        
        {/* --- 文章部分 --- */}
        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-4"></h4>
          <p className="text-gray-700 leading-relaxed mb-6 font-medium">
            小中高大と12年以上バレーボールをしてきました。<br />
            やるのも好きだし、観るのも好き！<br /><br />
            ポジション : リベロ（大学では全部やりました！）
          </p>

          {/* 選手リスト */}
          <div className="bg-white/60 p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
            <p className="text-sm text-gray-500 mb-2 font-bold uppercase tracking-wider">好きな選手</p>
            <ul className="flex flex-wrap gap-4">
              {favoritePlayers.map((player) => (
                <li key={player.name} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-gray-800">
                  <span className="text-lg">{player.flag}</span>
                  <span className="text-sm font-bold">{player.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- 画像エリア --- */}
        <div className="space-y-10">
          
          {/* 画像1 */}
          <div>
            <p className="text-center text-gray-500 text-sm mb-2 font-medium">
              2025/10/24 (ブルテオンvsサントリー)
            </p>
            <div className="flex justify-center">
              {/* h-auto にして高さを自動調整し、object-cover を削除 */}
              <img
                src="/Portfolio/images/volleyball_2025_10_24.jpg"
                alt="Volleyball Match 2025_10_24"
                className="rounded-xl shadow-md border-4 border-white w-full max-w-3xl h-auto"
              />
            </div>
          </div>
          
          {/* 画像2 */}
          <div>
            <p className="text-center text-gray-500 text-sm mb-2 font-medium">
              2025/03/09 (サントリーvsブルテオン)
            </p>
            <div className="flex justify-center">
              <img
                src="/Portfolio/images/volleyball_2025_03_09.jpg"
                alt="Volleyball Match 2025_03_09"
                className="rounded-xl shadow-md border-4 border-white w-full max-w-3xl h-auto"
              />
            </div>
          </div>

          {/* 画像3 (2枚並び) */}
          <div>
            <p className="text-center text-gray-500 text-sm mb-2 font-medium">
              2025/02/17 仙台市体育館
            </p>
            {/* items-start を追加して、縦横比が違っても上揃えにする */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <img
                src="/Portfolio/images/haikyu_1.jpg"
                alt="haikyu_1"
                className="rounded-xl shadow-md border-4 border-white w-full h-auto"
              />
              <img
                src="/Portfolio/images/haikyu_2.jpg"
                alt="haikyu_2"
                className="rounded-xl shadow-md border-4 border-white w-full h-auto"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}