import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";
import { UserGateway } from "./user-gateway";

/**
 * テスト用のユーザーゲートウェイのモック実装
 */
export class MockUserGateway implements UserGateway {
  private users: User[] = [];
  private nextId = 1;

  /**
   * モックデータをリセットする
   */
  reset(): void {
    this.users = [];
    this.nextId = 1;
  }

  /**
   * モックユーザーデータを設定する
   * @param users 設定するユーザー
   */
  setUsers(users: User[]): void {
    this.users = [...users];
    // nextIdをユーザー配列内の最大IDより大きくする
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    this.nextId = maxId + 1;
  }

  /**
   * すべてのユーザーを取得する
   * @returns ユーザーの配列を含むPromise
   */
  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  /**
   * IDによりユーザーを取得する
   * @param id 取得するユーザーのID
   * @returns ユーザーを含むPromise
   */
  async getUserById(id: number): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return { ...user };
  }

  /**
   * 新しいユーザーを作成する
   * @param userData 作成するユーザーデータ
   * @returns 作成されたユーザーを含むPromise
   */
  async createUser(userData: Omit<UserFormData, "id">): Promise<User> {
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  /**
   * 既存のユーザーを更新する
   * @param id 更新するユーザーのID
   * @param userData 更新されたユーザーデータ
   * @returns 更新されたユーザーを含むPromise
   */
  async updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date()
    };

    this.users[index] = updatedUser;
    return { ...updatedUser };
  }

  /**
   * ユーザーを削除する
   * @param id 削除するユーザーのID
   */
  async deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
