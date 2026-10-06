import React, { useState } from 'react';
import Image from 'next/image';

type Category = 'Research' | 'Personal' | 'Team';

type Work = {
  id: string;
  title: string;
  category: Category;
  period: string;
  description: string;
  role?: string;
  tags: string[];
  url?: string;
  github?: string;
  wip?: boolean;
  hasDetails?: boolean;
};

const GITHUB = 'https://github.com/onigiri860';

const works: Work[] = [
  {
    id: 'renderer',
    title: '非微分可能レンダラーによる高速シーンパラメータ推定',
    category: 'Research',
    period: '2025 – 現在',
    description:
      '画像から物体の色・位置・回転などのシーンパラメータを逆算する「逆レンダリング」の研究。\n' +
      'ゲームエンジン Unity を高速な（微分できない）レンダラーとして使い、Python 側の数値最適化とプロセス間通信で連携させる。\n\n' +
      'ランダム探索と局所線形近似（Levenberg–Marquardt法）、ガウシアンブラーによる多段階最適化を組み合わせた、勾配を使わない推定手法を提案。' +
      'さらに、パラメータグループごとの探索比率を収束状況に応じて自動で切り替え、人手を介さずに複数グループを同時推定できるようにした。\n\n' +
      '微分可能レンダラー Mitsuba 3 より色推定で約9倍速く、Mitsuba 3 では勾配が不安定で失敗した位置推定でも安定して収束。ベイズ最適化 (Optuna) と比べて成功率100%、平均約29倍の速さを示した。',
    tags: ['Unity', 'Python', 'NumPy', 'Inverse Rendering', 'Optimization'],
    hasDetails: true,
  },
  {
    id: 'pokesleep',
    title: 'ポケスリ料理判定',
    category: 'Personal',
    period: '2026',
    description:
      'ポケモンスリープで、手持ちの食材から「今作れる料理」と「あと少しで作れる料理」を判定するWebツール。\n' +
      '食材の個数を入力するとカテゴリ別に結果を表示し、入力内容はブラウザに保存される。',
    tags: ['JavaScript', 'HTML/CSS', 'Cloudflare Workers'],
    github: `${GITHUB}/pokesleep`,
  },
  {
    id: 'catsns',
    title: 'catSNS',
    category: 'Personal',
    period: '2026',
    description:
      'SNSでうっかりおすすめを更新して、気になった投稿を見失う――あの感覚をゲームにしたもの。\n' +
      '更新後のタイムラインから、更新前に見えた投稿を探し出す。独自文字の投稿やダメージ表記、ゲームオーバー画面、イラストも自作。',
    tags: ['JavaScript', 'Game', 'Web'],
    url: 'https://onigiri860.github.io/catSNS/',
    github: `${GITHUB}/catSNS`,
  },
  {
    id: 'portfolio',
    title: 'このポートフォリオサイト',
    category: 'Personal',
    period: '2025 – 現在',
    description:
      '通常のWeb版と、街を歩き回って各セクションを見られる3D版の2つを用意したポートフォリオ。\n' +
      'React Three Fiber で3D空間を構築し、スマホではジョイスティック操作にも対応。',
    tags: ['Next.js', 'TypeScript', 'React Three Fiber', 'Tailwind CSS'],
    url: 'https://onigiri860.github.io/Portfolio/',
    github: `${GITHUB}/Portfolio`,
  },
  {
    id: 'kozucoach',
    title: 'KozuCoach',
    category: 'Personal',
    period: '2026',
    description:
      '写真の構図をチェックするツールの試作。\nエッジ検出とハフ変換で地平線を見つけ、その傾きから構図スコアを算出する。',
    tags: ['Python', 'OpenCV'],
    github: `${GITHUB}/KozuCoach`,
  },
  {
    id: 'sushi-king',
    title: 'SUSHI KING',
    category: 'Team',
    period: '',
    description: 'クッキングシミュレーターゲーム。',
    role: '発案・コーディング担当',
    tags: ['Game', 'Team Dev'],
    url: 'https://prapro-ou.github.io/FILO/production',
  },
  {
    id: 'calendar',
    title: '共有カレンダーアプリ',
    category: 'Personal',
    period: '2025',
    description:
      '研究室で利用するための共有カレンダーWebアプリ。\n今後は既存の在室管理アプリケーションとの統合を予定。',
    tags: ['Web App', 'Lab Tool'],
    url: 'https://t-lab2025.github.io/shared-calendar/',
  },
  {
    id: 'volleyball-game',
    title: 'バレーボールゲーム',
    category: 'Personal',
    period: '',
    description:
      'レシーバー視点の一人称ゲーム。\nボールにマグヌス効果などを与え、バレーボール特有の回転や軌道を物理演算で再現。',
    tags: ['Unity', 'Physics'],
    wip: true,
  },
  {
    id: 'commandbattle',
    title: 'コマンドバトル',
    category: 'Personal',
    period: '2024',
    description:
      'コマンドを選んで戦うRPG風バトルゲーム。\n体力バーやエフェクト、スタート・勝利・敗北画面の遷移をCanvasで実装。',
    tags: ['JavaScript', 'Canvas', 'Game'],
    github: `${GITHUB}/commandbattle`,
  },
];

const publications = [
  {
    venue: 'IW-FCV 2026',
    date: '2026.10',
    title: 'Fast Scene Parameter Estimation via Reconstruction Error Minimization Using a Non-Differentiable Renderer',
  },
  {
    venue: 'MIRU2026（第29回 画像の認識・理解シンポジウム）',
    date: '2026.08',
    title: '非微分可能レンダラーによる再構成誤差を用いたシーンパラメータの高速推定',
  },
];

const categoryStyle: Record<Category, { label: string; className: string }> = {
  Research: { label: '研究', className: 'bg-sky-100 text-sky-700 border-sky-200' },
  Personal: { label: '個人開発', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  Team: { label: 'チーム開発', className: 'bg-rose-100 text-rose-700 border-rose-200' },
};

const filters: ('All' | Category)[] = ['All', 'Research', 'Personal', 'Team'];

function ExternalIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .5z" />
    </svg>
  );
}

// 研究カードの展開部分（デモ動画・推定結果・実験結果）
const scenes = [
  {
    id: 'cornell',
    label: 'コーネルボックス',
    note: '球の位置と壁の色を推定',
    images: {
      initial: '/Portfolio/images/initial.jpg',
      optimized: '/Portfolio/images/optimized.jpg',
      target: '/Portfolio/images/target.jpg',
    },
  },
  {
    id: 'furniture',
    label: '家具シーン',
    note: '散らばった椅子・クッションの位置と回転を約40秒で復元（Blenderアセットを使用）',
    images: {
      initial: '/Portfolio/images/research/furniture_initial.jpg',
      optimized: '/Portfolio/images/research/furniture_optimized.jpg',
      target: '/Portfolio/images/research/furniture_target.jpg',
    },
  },
  {
    id: 'bunny',
    label: 'バニー＋ティーポット',
    note: 'Stanford bunny と Utah teapot の位置、壁の色の計9次元を同時推定（約28.7秒）',
    images: {
      initial: '/Portfolio/images/research/bunny_initial.jpg',
      optimized: '/Portfolio/images/research/bunny_optimized.jpg',
      target: '/Portfolio/images/research/bunny_target.jpg',
    },
  },
];

const results = [
  { label: 'vs Mitsuba 3（色推定）', ours: '約 0.7 秒', theirs: '約 6.2 秒', note: '約9倍高速' },
  { label: 'vs Optuna（位置推定）', ours: '成功率 100% / 約 2.8 秒', theirs: '成功率 60% / 約 82.3 秒', note: '平均約29倍高速' },
  { label: '3グループ同時推定（9次元）', ours: '約 10.1 秒・成功率 約80%', theirs: '—', note: '色＋2物体の位置を自動で同時推定' },
  { label: '複雑形状（バニー＋ティーポット）', ours: '約 28.7 秒', theirs: '—', note: '形状によらず推定できることを確認' },
];

function ResearchDetails() {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const scene = scenes.find((s) => s.id === sceneId)!;
  const frames = [
    { src: scene.images.initial, label: '初期画像', frame: 'border border-gray-300', badge: 'text-gray-500 bg-gray-100' },
    { src: scene.images.optimized, label: '推定結果', frame: 'border-2 border-sky-500', badge: 'text-sky-700 bg-sky-100' },
    { src: scene.images.target, label: '目標画像', frame: 'border-2 border-amber-400', badge: 'text-amber-700 bg-amber-100' },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
      <div>
        <h5 className="font-bold text-gray-700 text-sm mb-1">システム動作デモ</h5>
        <p className="text-xs text-gray-500 mb-2">（デモのため1つの位置と1つの色のみ推定）</p>
        <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg border border-gray-300">
          <video
            src="/Portfolio/videos/説明動画.mp4"
            poster="/Portfolio/images/initial.jpg"
            controls
            className="w-full max-h-[400px] object-contain mx-auto"
          />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h5 className="font-bold text-gray-700 text-sm mr-auto">推定結果</h5>
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSceneId(s.id)}
              className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                s.id === sceneId ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-3">{scene.note}</p>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {frames.map((img) => (
            <div key={img.label} className="flex flex-col items-center">
              <div className={`w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm relative group ${img.frame}`}>
                <Image src={img.src} alt={`${scene.label} ${img.label}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className={`mt-2 text-xs font-bold px-2 py-1 rounded-full ${img.badge}`}>{img.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-bold text-gray-700 text-sm mb-2">実験結果</h5>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left font-bold px-3 py-2">比較</th>
                <th className="text-left font-bold px-3 py-2 text-sky-700">提案手法</th>
                <th className="text-left font-bold px-3 py-2">比較手法</th>
                <th className="text-left font-bold px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {results.map((r) => (
                <tr key={r.label}>
                  <td className="px-3 py-2 font-bold text-gray-700 whitespace-nowrap">{r.label}</td>
                  <td className="px-3 py-2 text-sky-700 font-bold whitespace-nowrap">{r.ours}</td>
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.theirs}</td>
                  <td className="px-3 py-2 text-gray-600 min-w-[10rem]">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">RTX 5090 / Unity 6.2 / Python 3.13、コーネルボックスは 512×512 px</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h5 className="font-bold text-gray-800 text-xs mb-2">Technical Highlights</h5>
        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
          <li><strong>Unity × Python 連携:</strong> Unity が画像とパラメータを送り、Python が更新パラメータを返すループ。必要なパラメータだけを可変長で送受信</li>
          <li><strong>局所線形近似:</strong> 集めたサンプルから Levenberg–Marquardt 法で更新量を求めるニュートン型の更新。停滞・発散時は最良解に戻って探索範囲を広げ直す</li>
          <li><strong>多段階ブラー:</strong> 強いガウシアンブラー（σ = 9 → 5 → 0）から始めて大まかな構造を先に合わせ、局所解を回避</li>
          <li><strong>同時推定の自動化:</strong> 色・位置などのグループごとに摂動させる比率をブラー段階に合わせて変え、手動の切り替えなしで全パラメータを推定</li>
          <li><strong>シーン構築の容易さ:</strong> Unity の GUI と Blender のアセットでシーンを作るだけで推定対象にできる</li>
        </ul>
      </div>
    </div>
  );
}

export default function Works() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | Category>('All');

  const visible = filter === 'All' ? works : works.filter((w) => w.category === filter);

  return (
    <section id="works" className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-amber-600 flex items-center gap-2">Works</h3>

      {/* 学会発表 */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
        <h4 className="text-sm font-bold text-sky-700 mb-3">学会発表</h4>
        <ul className="space-y-3">
          {publications.map((p) => (
            <li key={p.venue} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="shrink-0 text-xs font-mono font-bold text-sky-600">{p.date}</span>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-snug">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.venue}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
              filter === f ? 'bg-amber-500 text-white border-amber-500' : 'bg-white/70 text-gray-600 border-gray-200 hover:border-amber-300'
            }`}
          >
            {f === 'All' ? 'すべて' : categoryStyle[f].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((work) => {
          const expanded = expandedId === work.id;
          const cat = categoryStyle[work.category];
          return (
            <div
              key={work.id}
              className={`flex flex-col p-6 bg-white/60 rounded-xl border border-gray-200 hover:bg-white hover:border-amber-300 transition-all shadow-sm hover:shadow-md ${expanded ? 'md:col-span-2' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2 text-[10px] font-bold">
                <span className={`px-2 py-0.5 rounded-full border ${cat.className}`}>{cat.label}</span>
                {work.wip && <span className="px-2 py-0.5 rounded-full border bg-gray-100 text-gray-600 border-gray-200">開発中</span>}
                {work.period && <span className="text-gray-400 font-mono ml-auto">{work.period}</span>}
              </div>

              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="text-lg font-bold text-gray-900 leading-tight">{work.title}</h4>
                <div className="flex gap-2 shrink-0 text-gray-400">
                  {work.github && (
                    <a href={work.github} target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" title="GitHub">
                      <GitHubIcon />
                    </a>
                  )}
                  {work.url && (
                    <a href={work.url} target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors" title="サイトを見る">
                      <ExternalIcon />
                    </a>
                  )}
                </div>
              </div>

              {work.role && <p className="text-xs font-bold text-rose-600 mb-2">{work.role}</p>}

              <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{work.description}</p>

              {work.hasDetails && (
                <div className="mb-4 w-full">
                  <button
                    onClick={() => setExpandedId(expanded ? null : work.id)}
                    className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 transition-colors text-sm"
                  >
                    {expanded ? '詳細を閉じる ▲' : 'デモ動画・推定結果を見る ▼'}
                  </button>
                  {expanded && <ResearchDetails />}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {work.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-[10px] font-bold rounded border bg-gray-50 text-gray-600 border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
