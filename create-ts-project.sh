#!/bin/bash

# create-ts-project.sh
# TypeScriptプロジェクトを作成するスクリプト

# 使用方法を表示する関数
show_usage() {
  echo "使用方法: ./create-ts-project.sh <プロジェクト名> [オプション]"
  echo ""
  echo "オプション:"
  echo "  --type <type>    プロジェクトタイプ (library または application, デフォルト: library)"
  echo "  --help           このヘルプメッセージを表示"
  echo ""
  echo "例:"
  echo "  ./create-ts-project.sh my-new-project"
  echo "  ./create-ts-project.sh my-app --type application"
}

# パラメータのチェック
if [ "$1" == "--help" ] || [ $# -eq 0 ]; then
  show_usage
  exit 0
fi

PROJECT_NAME=$1
shift

# デフォルト値の設定
PROJECT_TYPE="library"

# オプションの解析
while [[ $# -gt 0 ]]; do
  case "$1" in
    --type)
      PROJECT_TYPE="$2"
      if [[ "$PROJECT_TYPE" != "library" && "$PROJECT_TYPE" != "application" ]]; then
        echo "エラー: プロジェクトタイプは 'library' または 'application' である必要があります"
        exit 1
      fi
      shift 2
      ;;
    *)
      echo "不明なオプション: $1"
      show_usage
      exit 1
      ;;
  esac
done

# プロジェクト名がkebab-caseかチェック
if [[ ! "$PROJECT_NAME" =~ ^[a-z][a-z0-9]*(-[a-z0-9]+)*$ ]]; then
  echo "エラー: プロジェクト名は kebab-case である必要があります (例: my-project)"
  exit 1
fi

# プロジェクトディレクトリの作成
mkdir -p "$PROJECT_NAME/src"

# package.jsonの作成
if [ "$PROJECT_TYPE" == "library" ]; then
  cat > "$PROJECT_NAME/package.json" << EOF
{
  "name": "${PROJECT_NAME}",
  "version": "0.1.0",
  "description": "",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepublishOnly": "npm run build"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
  },
  "devDependencies": {
    "@types/node": "^22.15.29",
    "eslint": "^9.28.0",
    "prettier": "^3.0.0",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
EOF
else
  cat > "$PROJECT_NAME/package.json" << EOF
{
  "name": "${PROJECT_NAME}",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "MIT",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "node dist/index.js",
    "start:dev": "ts-node src/index.ts",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage"
  },
  "dependencies": {
  },
  "devDependencies": {
    "@types/node": "^22.15.29",
    "eslint": "^9.28.0",
    "prettier": "^3.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
EOF
fi

# tsconfig.jsonの作成
cat > "$PROJECT_NAME/tsconfig.json" << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
EOF

# .gitignoreの作成
cat > "$PROJECT_NAME/.gitignore" << EOF
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build
/dist

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# サンプルファイルの作成
if [ "$PROJECT_TYPE" == "library" ]; then
  cat > "$PROJECT_NAME/src/index.ts" << EOF
/**
 * ${PROJECT_NAME} のメインエントリーポイント
 */
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
EOF

  # テストディレクトリとサンプルテストの作成
  mkdir -p "$PROJECT_NAME/src/__tests__"
  cat > "$PROJECT_NAME/src/__tests__/index.test.ts" << EOF
import { describe, it, expect } from 'vitest';
import { greet } from '../index';

describe('greet関数', () => {
  it('名前付きの挨拶を返す', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
EOF
else
  cat > "$PROJECT_NAME/src/index.ts" << EOF
/**
 * ${PROJECT_NAME} のメインエントリーポイント
 */
function main() {
  console.log('Hello, world!');
}

main();
EOF

  # テストディレクトリとサンプルテストの作成
  mkdir -p "$PROJECT_NAME/test"
  cat > "$PROJECT_NAME/test/app.test.ts" << EOF
import { describe, it, expect } from 'vitest';

describe('アプリケーション', () => {
  it('テストが正常に実行される', () => {
    expect(true).toBe(true);
  });
});
EOF
fi

# vite.config.tsの作成
cat > "$PROJECT_NAME/vitest.config.ts" << EOF
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
EOF

# 実行権限を付与
chmod +x "$PROJECT_NAME/package.json"

echo "✅ ${PROJECT_NAME} プロジェクトが正常に作成されました！"
echo ""
echo "次のコマンドでプロジェクトを開始できます："
echo "  cd ${PROJECT_NAME}"
echo "  npm install"
echo "  npm test"