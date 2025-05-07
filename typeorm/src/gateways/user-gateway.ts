import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";

/**
 * ユーザーゲートウェイのインターフェース
 * ユーザーデータへのアクセスに関する契約を定義する
 */
export interface UserGateway {
  /**
   * すべてのユーザーを取得する
   * @returns ユーザーの配列を含むPromise
   */
  getUsers(): Promise<User[]>;

  /**
   * IDによりユーザーを取得する
   * @param id 取得するユーザーのID
   * @returns ユーザーを含むPromise
   */
  getUserById(id: number): Promise<User>;

  /**
   * 新しいユーザーを作成する
   * @param userData 作成するユーザーデータ
   * @returns 作成されたユーザーを含むPromise
   */
  createUser(userData: Omit<UserFormData, "id">): Promise<User>;

  /**
   * 既存のユーザーを更新する
   * @param id 更新するユーザーのID
   * @param userData 更新されたユーザーデータ
   * @returns 更新されたユーザーを含むPromise
   */
  updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User>;

  /**
   * ユーザーを削除する
   * @param id 削除するユーザーのID
   */
  deleteUser(id: number): Promise<void>;
}
