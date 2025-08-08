/**
 * 静的プロパティ名を自動的にインスタンスのnameプロパティに設定するデコレータ
 */
export function AutoName<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  // クラスのコンストラクタを保存
  const original = constructor;

  // 静的プロパティを検出して名前を設定するための処理
  Object.entries(constructor).forEach(([key, value]) => {
    if (value instanceof constructor) {
      // 静的プロパティの名前をインスタンスに設定
      Object.defineProperty(value, "name", {
        value: key,
        writable: false,
        enumerable: true,
      });
    }
  });

  return original;
}

@AutoName
export class SampleStatus {
  static ONE = new SampleStatus(1, ["aaa"]);
  static TWO = new SampleStatus(2, ["bbb"]);

  constructor(
    readonly index: number,
    arr: string[],
  ) {}
}
