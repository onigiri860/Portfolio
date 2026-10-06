# portfolio-spotify

ポートフォリオの Music セクションに「いま聴いてる曲」「最近聴いた曲」を出すための Cloudflare Worker。

## セットアップ

1. https://developer.spotify.com/dashboard でアプリを作成
   - Redirect URI に `http://127.0.0.1:8888/callback` を追加
   - 「Web API」にチェック
   - Client ID と Client Secret を控える
2. リフレッシュトークンを取得（ブラウザで Spotify にログインして許可する）
   ```powershell
   $env:SPOTIFY_CLIENT_ID="<Client ID>"
   $env:SPOTIFY_CLIENT_SECRET="<Client Secret>"
   node get-refresh-token.mjs
   ```
3. Worker にシークレットを登録してデプロイ
   ```bash
   npx wrangler secret put SPOTIFY_CLIENT_ID
   npx wrangler secret put SPOTIFY_CLIENT_SECRET
   npx wrangler secret put SPOTIFY_REFRESH_TOKEN
   npx wrangler deploy
   ```
   表示された URL（`https://portfolio-spotify.<アカウント>.workers.dev`）を控える。
4. `my-portfolio/.env.local` に URL を書いてビルド・デプロイ
   ```
   NEXT_PUBLIC_SPOTIFY_ENDPOINT=https://portfolio-spotify.<アカウント>.workers.dev
   ```

シークレットはすべて Cloudflare 側に保存されるので、リポジトリにもサイトにも出ない。
