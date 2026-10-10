import React, { useEffect, useState } from 'react';

type Track = {
  title: string;
  artist: string;
  album: string;
  image: string | null;
  url: string;
};

type Artist = {
  name: string;
  image: string | null;
  url: string;
};

type MusicData = {
  recent: (Track & { playedAt: string })[];
  // 直近約4週間でよく聴いた順（Worker が古いと無いこともある）
  topTracks?: Track[];
  topArtists?: Artist[];
};

// spotify-worker をデプロイした URL（.env.local / ビルド時の環境変数で指定）
const ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_ENDPOINT;

// トップのカードとモーダルで同じデータを使うので、取得は1回にまとめる
let musicRequest: Promise<MusicData> | null = null;
function fetchMusic() {
  if (!ENDPOINT) return Promise.reject(new Error('no endpoint'));
  musicRequest ??= fetch(ENDPOINT)
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json() as Promise<MusicData>;
    })
    .catch((e) => {
      musicRequest = null;
      throw e;
    });
  return musicRequest;
}

function timeAgo(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return 'たった今';
  if (min < 60) return `${min}分前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

function Cover({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`${className} object-cover`} />
  ) : (
    <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-400`}>♪</div>
  );
}

const rankColor = ['text-amber-500', 'text-gray-400', 'text-orange-400'];

// ジャケットを大きく並べて横スクロールさせる
const rowClass = 'flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:thin]';
const cardClass = 'w-28 sm:w-36 shrink-0 snap-start';
const coverClass = 'w-28 h-28 sm:w-36 sm:h-36 shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition';

function Ranking({ tracks, artists }: { tracks: Track[]; artists: Artist[] }) {
  const [tab, setTab] = useState<'tracks' | 'artists'>(tracks.length > 0 ? 'tracks' : 'artists');
  const items =
    tab === 'tracks'
      ? tracks.map((t) => ({ key: t.url, title: t.title, sub: t.artist, image: t.image, url: t.url }))
      : artists.map((a) => ({ key: a.url, title: a.name, sub: '', image: a.image, url: a.url }));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h4 className="text-sm font-bold text-gray-700 mr-auto">
          よく聴いてる <span className="text-xs font-normal text-gray-400">（直近4週間）</span>
        </h4>
        <div className="flex gap-2">
          {(['tracks', 'artists'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                tab === t ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
              }`}
            >
              {t === 'tracks' ? '曲' : 'アーティスト'}
            </button>
          ))}
        </div>
      </div>

      <ol className={rowClass}>
        {items.map((item, i) => (
          <li key={item.key} className={cardClass}>
            <a href={item.url} target="_blank" rel="noreferrer" className="group block">
              <div className="relative">
                <Cover src={item.image} alt={item.title} className={`${coverClass} ${tab === 'artists' ? 'rounded-full' : 'rounded-xl'}`} />
                <span className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center text-sm font-black tabular-nums ${rankColor[i] ?? 'text-gray-400'}`}>
                  {i + 1}
                </span>
              </div>
              <p className={`mt-2 text-sm font-bold text-gray-900 truncate ${tab === 'artists' ? 'text-center' : ''}`}>{item.title}</p>
              {item.sub && <p className="text-xs text-gray-500 truncate">{item.sub}</p>}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Music() {
  const [data, setData] = useState<MusicData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ENDPOINT) return;
    let cancelled = false;

    const load = async () => {
      try {
        const json = await fetchMusic();
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-purple-600 flex items-center gap-2">Music</h3>

      {!ENDPOINT || error ? (
        <p className="text-gray-500 text-sm">
          {ENDPOINT ? 'Spotify に接続できませんでした。少し時間をおいて開き直してください。' : 'Spotify 連携は準備中です。'}
        </p>
      ) : !data ? (
        <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
      ) : (
        <div className="space-y-8">
          {/* よく聴いてる曲・アーティスト */}
          {((data.topTracks?.length ?? 0) > 0 || (data.topArtists?.length ?? 0) > 0) && (
            <Ranking tracks={data.topTracks ?? []} artists={data.topArtists ?? []} />
          )}

          {/* 最近聴いた曲 */}
          {data.recent.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">最近聴いた曲</h4>
              <ul className={rowClass}>
                {data.recent.map((t) => (
                  <li key={t.playedAt} className={cardClass}>
                    <a href={t.url} target="_blank" rel="noreferrer" className="group block">
                      <Cover src={t.image} alt={t.album} className={`${coverClass} rounded-xl`} />
                      <p className="mt-2 text-sm font-bold text-gray-900 truncate">{t.title}</p>
                      <p className="text-xs text-gray-500 truncate">{t.artist}</p>
                      <p className="text-[10px] text-gray-400">{timeAgo(t.playedAt)}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-right">via Spotify</p>
        </div>
      )}
    </section>
  );
}

// トップのカード用: よく聴いてる曲のジャケットを3枚重ねて出す
export function MusicPreview() {
  const [covers, setCovers] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchMusic()
      .then((data) => {
        if (cancelled) return;
        const tracks = data.topTracks?.length ? data.topTracks : data.recent;
        setCovers(tracks.map((t) => t.image).filter((src): src is string => !!src).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (covers.length === 0) return null;
  return (
    <div className="flex -space-x-5">
      {covers.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="w-16 h-16 rounded-lg object-cover shadow-md border-2 border-white group-hover:-translate-y-1 transition-transform"
          style={{ transform: `rotate(${(i - 1) * 6}deg)`, zIndex: 3 - i }}
        />
      ))}
    </div>
  );
}
