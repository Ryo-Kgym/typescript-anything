import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PGliteAdapter, PGliteAdapterOptions } from '../pglite-adapter';

// PGliteのモック
vi.mock('pglite', () => {
  return {
    PGlite: vi.fn().mockImplementation(() => {
      return {
        start: vi.fn().mockResolvedValue(undefined),
        stop: vi.fn().mockResolvedValue(undefined)
      };
    })
  };
});

describe('PGliteAdapter', () => {
  let adapter: PGliteAdapter;
  let defaultOptions: PGliteAdapterOptions;

  beforeEach(() => {
    defaultOptions = {
      dbPath: ':memory:',
      port: 5432,
      dbName: 'test',
      username: 'test',
      password: 'test'
    };
    adapter = new PGliteAdapter(defaultOptions);
  });

  afterEach(async () => {
    try {
      await adapter.stop();
    } catch (e) {
      // エラーを無視
    }
  });

  it('デフォルトオプションで初期化できること', () => {
    const defaultAdapter = new PGliteAdapter();
    expect(defaultAdapter).toBeDefined();
  });

  it('カスタムオプションで初期化できること', () => {
    const customOptions: PGliteAdapterOptions = {
      dbPath: './custom.db',
      port: 5433,
      dbName: 'custom',
      username: 'custom',
      password: 'custom'
    };
    
    const customAdapter = new PGliteAdapter(customOptions);
    expect(customAdapter).toBeDefined();
  });

  it('start()メソッドがPGliteサーバーを起動すること', async () => {
    await adapter.start();
    // PGliteのstartメソッドが呼ばれたことを確認
    const pgliteInstance = (adapter as any).pglite;
    expect(pgliteInstance.start).toHaveBeenCalledWith({
      port: defaultOptions.port
    });
  });

  it('stop()メソッドがPGliteサーバーを停止すること', async () => {
    await adapter.start();
    await adapter.stop();
    // PGliteのstopメソッドが呼ばれたことを確認
    const pgliteInstance = (adapter as any).pglite;
    expect(pgliteInstance.stop).toHaveBeenCalled();
  });

  it('getDatabaseUrl()メソッドが正しいURL文字列を返すこと', () => {
    const url = adapter.getDatabaseUrl();
    const expected = `postgresql://${defaultOptions.username}:${defaultOptions.password}@localhost:${defaultOptions.port}/${defaultOptions.dbName}`;
    expect(url).toBe(expected);
  });

  it('getPrismaEnv()メソッドが正しい環境変数オブジェクトを返すこと', () => {
    const env = adapter.getPrismaEnv();
    expect(env).toEqual({
      DATABASE_URL: adapter.getDatabaseUrl()
    });
  });

  it('サーバーが既に起動している場合、start()を呼んでも二重起動しないこと', async () => {
    await adapter.start();
    await adapter.start(); // 2回目の呼び出し
    
    const pgliteInstance = (adapter as any).pglite;
    // startメソッドが1回だけ呼ばれたことを確認
    expect(pgliteInstance.start).toHaveBeenCalledTimes(1);
  });

  it('サーバーが起動していない場合、stop()を呼んでもエラーにならないこと', async () => {
    // startを呼ばずにstopを呼ぶ
    await expect(adapter.stop()).resolves.not.toThrow();
  });
});