```text
apps/
  api/
    src/
      app.ts              // Honoアプリの組み立て（全ルートの登録）
      server.ts           // サーバー起動（Node/Bun/Cloudflare Worker 等）

      routes/             // Honoルーター（HTTPリクエストを受けるだけの層）
        index.ts          // 全 feature/usecase ルートの集約
        health.ts         // /health の生存確認API
        photos/           
          index.ts        // /photos 以下のルーティング
        users/
          index.ts        // /users 以下のルーティング

      usecase/            // ドメインごとのアプリケーションロジック（DDD Application 層 + Domain 層）
        photos/
          usecases/       // 写真アップロード / 一覧 / タグ付けなど
            uploadPhoto.ts
            listPhotos.ts
            addAiTags.ts
          entities/       // Photo, Tag などのドメインモデル
            photo.ts
            tag.ts
          dto/            // Request/Response DTO（API の返却形式）
            photoDto.ts
          services/       // 写真ドメインに関わるサービス（AIタグ生成など）
            tagGenerator.ts

        users/
          usecases/
          entities/
          dto/

      infra/              // DB・外部サービスとの接続層（外部I/Oの実装）
        db/
          prismaClient.ts     // Prisma 初期化
          photoRepository.ts  // 写真リポジトリ
          userRepository.ts   // ユーザーリポジトリ
        storage/
          s3Client.ts         // S3 / R2 / MinIO の操作ラッパー
        auth/
          firebase.ts         // Firebase の ID トークン検証
        llm/
          openaiClient.ts     // AI タグ生成のクライアント
        config/
          env.ts              // 環境変数のスキーマ定義 & 読み込み（zod推奨）

      core/               // API 全体で共有する基盤コード
        http/
          errorHandler.ts     // 共通エラーハンドリング
          response.ts         // レスポンス共通フォーマット
          middleware.ts       // 認証・ログ・トレースID付与など
        errors/
          AppError.ts         // カスタムエラーのベースクラス
        logger/
          logger.ts           // Pino など
        types/
          index.ts            // 共通型（Utility types など）

      utils/              // 汎用ユーティリティ（層に属さない純粋関数）
        date.ts
        string.ts

    test/                 // テスト
      photos/
      users/

    package.json
    tsconfig.json
    vite.config.ts?       // Bun/CloudflareWorker 向けに必要なら
```

### migrate
pnpm prisma:migrate dev --name 〇〇

型が参照しない時は
pnpm prisma generate

改行を一行のjsonへ
cat stg-refeel-chronicle-1bbcebd93f16.json | jq -c . > service-account.min.json

### サーバ側のコード修正後手順
ビルド
- pnpm run build

ビルド後の作成ファイル確認
- ls -la ./dist | head

起動確認
- node ./dist/server.js

システムサービスとして起動
- sudo systemctl daemon-reload

再起動
- sudo systemctl restart refeel-api-stg

ログ確認
- sudo journalctl -u refeel-api-stg --since "5 min ago" --no-pager

ヘルスチェック
- curl -i http://127.0.0.1:4250/health

ステージング環境ヘルスチェック
- curl -i https://stg-api.refeel-chronicle.com/health