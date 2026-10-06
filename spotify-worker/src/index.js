// Spotify の「今聴いている曲」と「最近聴いた曲」を返す Cloudflare Worker。
// 必要なシークレット: SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN

const ALLOWED_ORIGINS = ['https://onigiri860.github.io', 'http://localhost:3000'];

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1/me/player';
const TOP_API = 'https://api.spotify.com/v1/me/top';
const TOP_LIMIT = 10;

async function getAccessToken(env) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  return (await res.json()).access_token;
}

function toTrack(item) {
  return {
    title: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    album: item.album.name,
    image: item.album.images[0]?.url ?? null,
    url: item.external_urls.spotify,
  };
}

async function getMusic(env) {
  const token = await getAccessToken(env);
  const headers = { Authorization: `Bearer ${token}` };

  // short_term = 直近約4週間
  const top = `time_range=short_term&limit=${TOP_LIMIT}`;
  const [nowRes, recentRes, topTracksRes, topArtistsRes] = await Promise.all([
    fetch(`${API}/currently-playing`, { headers }),
    fetch(`${API}/recently-played?limit=6`, { headers }),
    fetch(`${TOP_API}/tracks?${top}`, { headers }),
    fetch(`${TOP_API}/artists?${top}`, { headers }),
  ]);

  let nowPlaying = null;
  // 204 = 何も再生していない
  if (nowRes.status === 200) {
    const now = await nowRes.json();
    if (now.is_playing && now.currently_playing_type === 'track' && now.item) {
      nowPlaying = { ...toTrack(now.item), progressMs: now.progress_ms, durationMs: now.item.duration_ms };
    }
  }

  const recent = recentRes.ok ? (await recentRes.json()).items.map((i) => ({ ...toTrack(i.track), playedAt: i.played_at })) : [];

  // user-top-read 権限がないトークンだと 403 になるので、その場合は空にする
  const topTracks = topTracksRes.ok ? (await topTracksRes.json()).items.map(toTrack) : [];
  const topArtists = topArtistsRes.ok
    ? (await topArtistsRes.json()).items.map((a) => ({
        name: a.name,
        image: a.images?.[0]?.url ?? null,
        url: a.external_urls.spotify,
      }))
    : [];

  return { nowPlaying, recent, topTracks, topArtists };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      Vary: 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: cors });

    try {
      const data = await getMusic(env);
      return Response.json(data, { headers: { ...cors, 'Cache-Control': 'public, max-age=20' } });
    } catch (e) {
      console.error(e);
      return Response.json({ error: 'spotify_unavailable' }, { status: 502, headers: cors });
    }
  },
};
