import React, { useEffect, useState } from 'react';

type Track = {
  title: string;
  artist: string;
  album: string;
  image: string | null;
  url: string;
};

type MusicData = {
  nowPlaying: (Track & { progressMs: number; durationMs: number }) | null;
  recent: (Track & { playedAt: string })[];
};

// spotify-worker をデプロイした URL（.env.local / ビルド時の環境変数で指定）
const ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_ENDPOINT;
const POLL_MS = 30_000;

function timeAgo(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return 'たった今';
  if (min < 60) return `${min}分前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

function Equalizer() {
  return (
    <span className="flex items-end gap-[2px] h-3">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="w-[3px] bg-green-500 rounded-sm animate-eq" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}

function Cover({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`${className} object-cover`} />
  ) : (
    <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-400`}>♪</div>
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
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error(String(res.status));
        const json: MusicData = await res.json();
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    const timer = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const now = data?.nowPlaying;
  const last = data?.recent[0];
  // 再生中でなければ最後に聴いた曲を大きく出す
  const featured = now ?? last;

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
          {/* 再生中 / 最後に聴いた曲 */}
          {featured && (
            <a
              href={featured.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-5 p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <Cover src={featured.image} alt={featured.album} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl shrink-0 shadow-md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold mb-2 text-green-400">
                  {now ? (
                    <>
                      <Equalizer /> いま聴いてる
                    </>
                  ) : (
                    <span className="text-gray-400">最後に聴いた曲・{last && timeAgo(last.playedAt)}</span>
                  )}
                </div>
                <p className="text-lg font-bold truncate">{featured.title}</p>
                <p className="text-sm text-gray-300 truncate">{featured.artist}</p>
                {now && (
                  <div className="mt-3 h-1 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(now.progressMs / now.durationMs) * 100}%` }} />
                  </div>
                )}
              </div>
            </a>
          )}

          {/* 最近聴いた曲 */}
          {data.recent.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">最近聴いた曲</h4>
              <ul className="divide-y divide-gray-100">
                {data.recent.map((t) => (
                  <li key={t.playedAt}>
                    <a href={t.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 py-2 hover:bg-purple-50/60 rounded-lg px-2 -mx-2 transition-colors">
                      <Cover src={t.image} alt={t.album} className="w-10 h-10 rounded-md shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{t.title}</p>
                        <p className="text-xs text-gray-500 truncate">{t.artist}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{timeAgo(t.playedAt)}</span>
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
