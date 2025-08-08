# TypeScript Anything

このリポジトリには、TypeScriptを使用したさまざまなプロジェクトが含まれています。

## プロジェクト

- **nestjs-vitest**: NestJSフレームワークを使用したアプリケーション（Vitestでテスト）
- **pglite-adapter-prisma**: PGliteとPrismaを使用したデータベースアダプター
- **refine**: Refineフレームワークを使用したプロジェクト
- **typeorm**: TypeORMを使用したプロジェクト

## 新しいTypeScriptプロジェクトの作成

このリポジトリには、新しいTypeScriptプロジェクトを簡単に作成するためのスクリプトが含まれています。

### 使用方法

```bash
./create-ts-project.sh <プロジェクト名> [オプション]
```

### オプション

- `--type <type>`: プロジェクトタイプ（`library` または `application`、デフォルト: `library`）
- `--help`: ヘルプメッセージを表示

### 例

```bash
# ライブラリプロジェクトの作成（デフォルト）
./create-ts-project.sh my-new-project

# アプリケーションプロジェクトの作成
./create-ts-project.sh my-app --type application
```

### 作成されるプロジェクト構造

#### ライブラリプロジェクト

```
my-new-project/
├── .gitignore
├── package.json
├── src/
│   ├── index.ts
│   └── __tests__/
│       └── index.test.ts
├── tsconfig.json
└── vitest.config.ts
```

#### アプリケーションプロジェクト

```
my-app/
├── .gitignore
├── package.json
├── src/
│   └── index.ts
├── test/
│   └── app.test.ts
├── tsconfig.json
└── vitest.config.ts
```

### プロジェクトの開始

プロジェクトを作成した後、以下のコマンドで開始できます：

```bash
cd <プロジェクト名>
npm install
npm test
```