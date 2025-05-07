/**
 * ユーザードメインモデル
 * TypeORMに依存しない純粋なユーザークラス
 */
export class User {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly isActive: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  /**
   * ユーザーの完全な名前を取得する
   * @returns 姓名を連結した文字列
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * ユーザーオブジェクトを複製して一部のプロパティを更新する
   * @param props 更新するプロパティ
   * @returns 更新されたユーザーオブジェクト
   */
  update(props: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): User {
    return new User(
      this.id,
      props.firstName ?? this.firstName,
      props.lastName ?? this.lastName,
      props.email ?? this.email,
      props.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}