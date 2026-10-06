// Spotify のリフレッシュトークンを1回だけ取得するスクリプト。
// 使い方:
//   $env:SPOTIFY_CLIENT_ID="..."; $env:SPOTIFY_CLIENT_SECRET="..."; node get-refresh-token.mjs   (PowerShell)
// 表示された URL をブラウザで開いて許可すると、ターミナルにリフレッシュトークンが出る。
import http from 'node:http';

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error('SPOTIFY_CLIENT_ID と SPOTIFY_CLIENT_SECRET を環境変数で指定してください');
  process.exit(1);
}

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ client_id: clientId, response_type: 'code', redirect_uri: REDIRECT_URI, scope: SCOPES });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') return res.end();

  const code = url.searchParams.get('code');
  if (!code) {
    res.end('認可されませんでした');
    return server.close();
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });
  const data = await tokenRes.json();

  if (data.refresh_token) {
    console.log('\nリフレッシュトークン（wrangler secret put SPOTIFY_REFRESH_TOKEN で登録）:\n');
    console.log(data.refresh_token);
    res.end('取得できました。ターミナルに戻ってください。');
  } else {
    console.error(data);
    res.end('取得に失敗しました。ターミナルを確認してください。');
  }
  server.close();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('このURLをブラウザで開いてください:\n');
  console.log(authUrl);
});
