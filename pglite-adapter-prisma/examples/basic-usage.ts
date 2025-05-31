import { PGliteAdapter } from '../src';
import { PrismaClient } from '@prisma/client';

async function main() {
  // PGliteアダプターの初期化
  const adapter = new PGliteAdapter({
    dbPath: ':memory:', // インメモリデータベースを使用
    port: 5432,
    dbName: 'example',
    username: 'user',
    password: 'password'
  });

  try {
    // PGliteサーバーを起動
    console.log('PGliteサーバーを起動中...');
    await adapter.start();
    console.log('PGliteサーバーが起動しました');

    // データベースURLを取得
    const databaseUrl = adapter.getDatabaseUrl();
    console.log(`データベースURL: ${databaseUrl}`);

    // Prisma Clientの初期化
    // 注意: 実際の使用では、スキーマファイルが必要です
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // ここでPrisma Clientを使用してデータベース操作を行います
    console.log('Prisma Clientを使用してデータベースに接続しました');

    // 例: マイグレーションの実行やデータの操作など
    // await prisma.$executeRaw`CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT)`;
    // await prisma.$executeRaw`INSERT INTO users (name) VALUES ('テストユーザー')`;
    // const users = await prisma.$queryRaw`SELECT * FROM users`;
    // console.log('ユーザー:', users);

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