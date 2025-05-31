import { PGliteAdapter } from '../src';
import { PrismaClient } from '@prisma/client';

async function main() {
  // PGliteアダプターの初期化
  const adapter = new PGliteAdapter({
    dbPath: './dev.db', // ファイルベースのデータベースを使用
    port: 5433, // デフォルトと異なるポートを使用
    dbName: 'blog',
    username: 'admin',
    password: 'secure_password'
  });

  try {
    // PGliteサーバーを起動
    console.log('PGliteサーバーを起動中...');
    await adapter.start();
    console.log('PGliteサーバーが起動しました');

    // Prisma用の環境変数を設定
    const env = adapter.getPrismaEnv();
    console.log('Prisma環境変数:', env);
    
    // 環境変数を実際に設定
    process.env.DATABASE_URL = env.DATABASE_URL;

    // Prisma Clientの初期化
    // 注意: 実際の使用では、`npx prisma generate`を実行してクライアントを生成する必要があります
    const prisma = new PrismaClient();
    
    console.log('Prisma Clientを使用してデータベースに接続しました');

    // データベースのセットアップ
    // 実際のアプリケーションでは、マイグレーションを使用します
    // 以下はデモンストレーション用の簡易的なセットアップです
    console.log('テーブルを作成中...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "name" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Post" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "content" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "authorId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("authorId") REFERENCES "User"("id")
      )
    `;
    console.log('テーブルが作成されました');

    // ユーザーの作成
    console.log('ユーザーを作成中...');
    const user = await prisma.$executeRaw`
      INSERT INTO "User" ("email", "name") 
      VALUES ('user@example.com', 'テストユーザー') 
      RETURNING *
    `;
    console.log('ユーザーが作成されました:', user);

    // 投稿の作成
    console.log('投稿を作成中...');
    const post = await prisma.$executeRaw`
      INSERT INTO "Post" ("title", "content", "published", "authorId") 
      VALUES ('はじめての投稿', 'これはPGliteとPrismaを使った最初の投稿です。', true, 1) 
      RETURNING *
    `;
    console.log('投稿が作成されました:', post);

    // データの取得
    console.log('データを取得中...');
    const users = await prisma.$queryRaw`SELECT * FROM "User"`;
    console.log('ユーザー一覧:', users);

    const posts = await prisma.$queryRaw`
      SELECT p.*, u.name as "authorName" 
      FROM "Post" p 
      JOIN "User" u ON p."authorId" = u.id
    `;
    console.log('投稿一覧:', posts);

    // Prisma Clientの切断
    await prisma.$disconnect();
    console.log('Prisma Clientを切断しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    // PGliteサーバーを停止
    await adapter.stop();
    console.log('PGliteサーバーを停止しました');
  }
}

// サンプルコードの実行
main().catch(console.error);