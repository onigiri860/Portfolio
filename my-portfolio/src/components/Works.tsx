import React, { useState } from 'react';

const works = [
  {
    id: 1,
    title: '非微分可能レンダラーによる高速シーンパラメータ推定',
    description: 'UnityとPython(NumPy)をNamedPipe通信で連携し、画像からシーン情報（位置・色・材質・光源強度）を高速に推定するシステム。\n\n'
    +    '多段階ブラー処理を用いた独自の最適化手法により、ノイズや局所解の影響を抑え、高解像度(8K)でも安定した推定を実現。\n\n'
    +    '既存の微分可能レンダラー(Mitsuba3)と比較し、「処理速度」「多数パラメータの同時推定」「初期値依存性の低さ」「シーン作成の容易性」において優位性を実証。',
    tags: ['Research', 'Unity', 'Python', 'NumPy', 'NamedPipe'],
    url: null,
    colors: {
      tags: [
        'bg-sky-100 text-sky-700 border-sky-200',    // Research
        'bg-green-100 text-green-700 border-green-200', // Unity
        'bg-blue-100 text-blue-700 border-blue-200', // Python
        'bg-gray-100 text-gray-700 border-gray-200', // NumPy
        'bg-purple-100 text-purple-700 border-purple-200' // NamedPipe
      ]
    }
  },
  {
    id: 2,
    title: 'SUSHI KING',
    description: 'クッキングシミュレーターゲーム。\n 共同開発にて発案およびコーディングを担当。',
    tags: ['Game Dev', 'Team Dev'],
    url: 'https://prapro-ou.github.io/FILO/production',
    colors: {
      tags: ['bg-orange-100 text-orange-700 border-orange-200', 'bg-red-100 text-red-700 border-red-200']
    }
  },
  {
    id: 3,
    title: '共有カレンダーアプリ',
    description: '研究室で利用するための共有カレンダーWebアプリ（個人開発）。\n 今後は既存の在室管理アプリケーションとの統合を予定。',
    tags: ['Web App', 'Lab Tool'],
    url: 'https://t-lab2025.github.io/shared-calendar/',
    colors: {
      tags: ['bg-indigo-100 text-indigo-700 border-indigo-200', 'bg-purple-100 text-purple-700 border-purple-200']
    }
  },
  {
    id: 4,
    title: '【開発中】バレーボールゲーム',
    description: 'レシーバー視点の一人称ゲーム。\n ボールにマグヌス効果などを与え、バレーボール特有の回転や軌道を物理演算で再現。',
    tags: ['Unity', 'Physics'],
    url: null, // 開発中のためリンクなし
    colors: {
      tags: ['bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-teal-100 text-teal-700 border-teal-200']
    }
  },
];

export default function Works() {
  // どのカードが展開されているかを管理するState (nullなら全て閉じている)
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // トグル切り替え関数
  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのクリック伝播を防ぐ（必要に応じて）
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="works" className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-amber-600 flex items-center gap-2">
        Works
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {works.map((work) => (
          <div 
            key={work.id} 
            className={`flex flex-col p-6 bg-white/60 rounded-xl border border-gray-200 hover:bg-white hover:border-amber-300 transition-all shadow-sm hover:shadow-md group relative ${expandedId === work.id ? 'row-span-2' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-bold text-gray-900 leading-tight pr-2">
                {work.title}
              </h4>
              {/* URLがある場合のみ外部リンクアイコンを表示 */}
              {work.url && (
                <a 
                  href={work.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                  title="View Site"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {work.description}
            </p>

            {/* --- ID: 1 のみ詳細トグルボタンを表示 --- */}
            {work.id === 1 && (
              <div className="mb-4 w-full">
                <button 
                  onClick={(e) => toggleExpand(work.id, e)}
                  className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {expandedId === work.id ? '詳細を閉じる ▲' : 'デモ動画・推定結果を見る ▼'}
                </button>

                {/* 展開される詳細エリア */}
                {expandedId === work.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in space-y-6">
                    
                    {/* 1. 動画エリア */}
                    <div>
                      <h5 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                        システム動作デモ
                      </h5>(デモのため1つの位置と1つの色のみ推定)
                      <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg border border-gray-300">
                        {/* 注意: public/Portfolio/videos/説明動画.mp4 にファイルを配置してください 
                        */}
                        <video 
                          src="/Portfolio/videos/説明動画.mp4" 
                          controls 
                          className="w-full max-h-[400px] object-contain mx-auto"
                        />
                      </div>
                    </div>

                    {/* 2. 画像比較エリア */}
                    <div>
                      <h5 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                        推定プロセスの可視化
                      </h5>
                      <div className="grid grid-cols-3 gap-3 md:gap-6">
                        {/* 初期画像 */}
                        <div className="flex flex-col items-center">
                          <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative group">
                             {/* public/Portfolio/images/research/initial.jpg */}
                            <img 
                              src="/Portfolio/images/initial.jpg" 
                              alt="初期画像" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <span className="mt-2 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">初期画像</span>
                        </div>

                        {/* 最適化画像 (結果) */}
                        <div className="flex flex-col items-center">
                          <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-sky-500 shadow-md relative group">
                            {/* public/Portfolio/images/research/optimized.jpg */}
                            <img 
                              src="/Portfolio/images/optimized.jpg" 
                              alt="最適化画像" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <span className="mt-2 text-xs font-bold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">最適化後</span>
                        </div>

                        {/* 目標画像 (正解) */}
                        <div className="flex flex-col items-center">
                          <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-amber-400 shadow-sm relative group">
                            {/* public/Portfolio/images/research/target.jpg */}
                            <img 
                              src="/Portfolio/images/target.jpg" 
                              alt="目標画像" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <span className="mt-2 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">目標画像 (Target)</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. テキスト詳細 */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 className="font-bold text-gray-800 text-xs mb-2">Technical Highlights</h5>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        <li><strong>通信最適化:</strong> NamedPipeにより、大量の画像データとパラメータを低遅延で双方向通信</li>
                        <li><strong>多段階ブラー:</strong> 最適化初期に画像をぼかすことで、エッジのズレによる勾配爆発を抑制</li>
                        <li><strong>高解像度対応:</strong> 8K (8192x8192) 解像度でのレンダリングと最適化ループを実現</li>
                        <li><strong>自動化機能:</strong> キー入力による最適化対象（材質・光・位置）のリアルタイム切り替え機能</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-auto items-center">
              {work.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-[10px] font-bold rounded border ${work.colors.tags[index] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                >
                  {tag}
                </span>
              ))}
              
              {/* URLがある場合は下部にもリンクボタンを表示 */}
              {work.url && (
                <a 
                  href={work.url}
                  target="_blank" 
                  rel="noreferrer"
                  className="ml-auto text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Visit
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}