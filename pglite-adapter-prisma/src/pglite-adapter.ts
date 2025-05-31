import { PGlite } from "@electric-sql/pglite";

/**
 * PGliteアダプターの設定オプション
 */
export interface PGliteAdapterOptions {
  /**
   * データベースファイルのパス
   */
  dbPath?: string;

  /**
   * ポート番号
   */
  port?: number;

  /**
   * データベース名
   */
  dbName?: string;

  /**
   * ユーザー名
   */
  username?: string;

  /**
   * パスワード
   */
  password?: string;
}

/**
 * PrismaとPGliteを接続するためのアダプタークラス
 */
export class PGliteAdapter {
  private pglite: PGlite;
  private options: PGliteAdapterOptions;
  private isRunning: boolean = false;

  /**
   * PGliteアダプターを初期化する
   *
   * @param options - アダプターの設定オプション
   */
  constructor(options: PGliteAdapterOptions = {}) {
    this.options = {
      dbPath: options.dbPath || ":memory:",
      port: options.port || 5432,
      dbName: options.dbName || "postgres",
      username: options.username || "postgres",
      password: options.password || "postgres",
    };

    this.pglite = new PGlite({
      dbPath: this.options.dbPath,
    });
  }

  /**
   * PGliteサーバーを起動する
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    await this.pglite.start({
      port: this.options.port,
    });

    this.isRunning = true;
  }

  /**
   * PGliteサーバーを停止する
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    await this.pglite.stop();
    this.isRunning = false;
  }

  /**
   * Prisma用のデータベースURL文字列を取得する
   */
  getDatabaseUrl(): string {
    return `postgresql://${this.options.username}:${this.options.password}@localhost:${this.options.port}/${this.options.dbName}`;
  }

  /**
   * Prisma用の環境変数を取得する
   */
  getPrismaEnv(): Record<string, string> {
    return {
      DATABASE_URL: this.getDatabaseUrl(),
    };
  }
}
