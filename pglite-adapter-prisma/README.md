# pglite-adapter-prisma

PGliteをPrismaで使用するためのアダプターライブラリです。このライブラリを使用することで、PGlite（軽量PostgreSQLデータベース）をPrismaと簡単に統合できます。

## インストール

```bash
npm install pglite-adapter-prisma
```

または

```bash
yarn add pglite-adapter-prisma
```

## 使い方

### 基本的な使い方

```typescript
import { PGliteAdapter } from 'pglite-adapter-prisma';
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
    await adapter.start();
    
    // データベースURLを取得
    const databaseUrl = adapter.getDatabaseUrl();
    
    // Prisma Clientの初期化
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // ここでPrisma Clientを使用してデータベース操作を行います
    
    // Prisma Clientの切断
    await prisma.$disconnect();
  } finally {
    // PGliteサーバーを停止
    await adapter.stop();
  }
}

main().catch(console.error);
```

### 環境変数の設定

Prismaは通常、環境変数からデータベース接続情報を取得します。PGliteAdapterを使用して環境変数を設定する例：

```typescript
import { PGliteAdapter } from 'pglite-adapter-prisma';
import { PrismaClient } from '@prisma/client';

async function main() {
  const adapter = new PGliteAdapter();
  
  try {
    await adapter.start();
    
    // Prisma用の環境変数を設定
    const env = adapter.getPrismaEnv();
    process.env.DATABASE_URL = env.DATABASE_URL;
    
    // 環境変数を使用してPrisma Clientを初期化
    const prisma = new PrismaClient();
    
    // データベース操作...
    
    await prisma.$disconnect();
  } finally {
    await adapter.stop();
  }
}
```

## オプション

`PGliteAdapter`コンストラクタは以下のオプションを受け取ります：

| オプション | 説明 | デフォルト値 |
|------------|------|------------|
| `dbPath` | データベースファイルのパス | `:memory:` (インメモリデータベース) |
| `port` | PGliteサーバーのポート番号 | `5432` |
| `dbName` | データベース名 | `postgres` |
| `username` | ユーザー名 | `postgres` |
| `password` | パスワード | `postgres` |

## API

### `PGliteAdapter`

#### `constructor(options?: PGliteAdapterOptions)`

アダプターを初期化します。

#### `async start(): Promise<void>`

PGliteサーバーを起動します。

#### `async stop(): Promise<void>`

PGliteサーバーを停止します。

#### `getDatabaseUrl(): string`

Prisma用のデータベースURL文字列を返します。

#### `getPrismaEnv(): Record<string, string>`

Prisma用の環境変数オブジェクトを返します。

## 開発

### 前提条件

- Node.js 14以上
- npm または yarn

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/pglite-adapter-prisma.git
cd pglite-adapter-prisma

# 依存関係のインストール
npm install

# ビルド
npm run build

# テスト
npm test
```

## ライセンス

MIT