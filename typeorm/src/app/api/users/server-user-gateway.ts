import { UserGateway } from "@/gateways/user-gateway";
import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";
import { UserRepository } from "@/database/repository/user-repository";

/**
 * サーバーサイドのユーザーゲートウェイ実装
 * このクラスはサーバーサイドでUserRepositoryを使用してUserGatewayインターフェースを実装する
 */
export class ServerUserGateway implements UserGateway {
  /**
   * すべてのユーザーを取得する
   * @returns ユーザーの配列を含むPromise
   */
  async getUsers(): Promise<User[]> {
    return await UserRepository.findAll();
  }

  /**
   * IDによりユーザーを取得する
   * @param id 取得するユーザーのID
   * @returns ユーザーを含むPromise
   */
  async getUserById(id: number): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * 新しいユーザーを作成する
   * @param userData 作成するユーザーデータ
   * @returns 作成されたユーザーを含むPromise
   */
  async createUser(userData: Omit<UserFormData, "id">): Promise<User> {
    return await UserRepository.create(userData);
  }

  /**
   * 既存のユーザーを更新する
   * @param id 更新するユーザーのID
   * @param userData 更新されたユーザーデータ
   * @returns 更新されたユーザーを含むPromise
   */
  async updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    const updatedUser = await UserRepository.update(id, userData);
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  /**
   * ユーザーを削除する
   * @param id 削除するユーザーのID
   */
  async deleteUser(id: number): Promise<void> {
    const success = await UserRepository.delete(id);
    if (!success) {
      throw new Error(`User with ID ${id} not found`);
    }
  }
}

// Export a singleton instance for convenience
export const serverUserGateway = new ServerUserGateway();