import React, { useEffect, useRef, useState } from 'react';

type GameItem = {
  title: string;
  platform: string;
  genre: string;
  comment: string;
  // Steam のゲームは appId を入れるとヘッダー画像とストアリンクが自動で付く
  steamAppId?: number;
  image?: string;
  url?: string;
  // 画像がないときの背景
  fallback?: { gradient: string; emoji: string };
  nowPlaying?: boolean;
};

const games: GameItem[] = [
  {
    title: 'イナズマイレブン 英雄たちのヴィクトリーロード',
    platform: 'Steam / Switch',
    genre: 'サッカーRPG',
    comment: '最近イナイレ熱がやべぇ。',
    steamAppId: 2799860,
    nowPlaying: true,
  },
  {
    title: 'オーバーウォッチ 2',
    platform: 'Steam',
    genre: 'FPS',
    comment: 'FPS枠。',
    steamAppId: 2357570,
  },
  {
    title: 'ポケモンスリープ',
    platform: 'スマホ',
    genre: '睡眠ゲーム',
    comment: '料理判定ツールを自作するくらい遊んでる。',
    url: 'https://www.pokemonsleep.net/',
    fallback: { gradient: 'from-indigo-400 via-sky-300 to-amber-200', emoji: '💤' },
    nowPlaying: true,
  },
  {
    title: 'Poppy Playtime',
    platform: 'Steam',
    genre: 'ホラー',
    comment: '',
    steamAppId: 1721470,
  },
];

const steamHeader = (id: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;
const steamStore = (id: number) => `https://store.steampowered.com/app/${id}/`;

// 読み込み中は灰色の箱を点滅させ、届いたらふわっと出す
function GameImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // キャッシュ済みだと onLoad より先に読み終わっていることがある
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);
  return (
    <>
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover group-hover:scale-105 transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}

export default function Game() {
  return (
    <section className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center gap-2">Game</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {games.map((game) => {
          const image = game.image ?? (game.steamAppId ? steamHeader(game.steamAppId) : undefined);
          const link = game.url ?? (game.steamAppId ? steamStore(game.steamAppId) : undefined);
          const Wrapper = link ? 'a' : 'div';

          return (
            <Wrapper
              key={game.title}
              {...(link ? { href: link, target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-red-300 transition-all"
            >
              {/* Steam のヘッダー画像と同じ比率 (460x215) */}
              <div className="relative aspect-[460/215] overflow-hidden bg-gray-100">
                {image ? (
                  <GameImage src={image} alt={game.title} />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${game.fallback?.gradient ?? 'from-gray-300 to-gray-100'} flex items-center justify-center`}>
                    <span className="text-5xl drop-shadow">{game.fallback?.emoji ?? '🎮'}</span>
                  </div>
                )}
                {game.nowPlaying && (
                  <span className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    プレイ中
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1 p-4">
                <h4 className="font-bold text-gray-900 leading-snug mb-2">{game.title}</h4>
                <div className="flex flex-wrap gap-1.5 mb-3 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">{game.genre}</span>
                  <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">{game.platform}</span>
                </div>
                {game.comment && <p className="text-sm text-gray-600 leading-relaxed">{game.comment}</p>}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}

// トップのカード用: ゲームの画像を3枚重ねて出す
export function GamePreview() {
  const images = games
    .map((g) => g.image ?? (g.steamAppId ? steamHeader(g.steamAppId) : undefined))
    .filter((src): src is string => !!src)
    .slice(0, 3);
  return (
    <div className="flex -space-x-8 sm:-space-x-10">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className="w-20 sm:w-28 aspect-[460/215] rounded-lg object-cover shadow-md border-2 border-white bg-gray-200 group-hover:-translate-y-1 transition-transform"
          style={{ transform: `rotate(${(i - 1) * 5}deg)`, zIndex: 3 - i }}
        />
      ))}
    </div>
  );
}
