import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";
import { UserGateway } from "./user-gateway";

/**
 * ユーザーゲートウェイのAPI実装
 * このクラスはユーザーに関連するすべてのAPI呼び出しを処理する
 */
export class ApiUserGateway implements UserGateway {
  /**
   * APIからすべてのユーザーを取得する
   * @returns ユーザーの配列を含むPromise
   */
  async getUsers(): Promise<User[]> {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  }

  /**
   * APIからIDによりユーザーを取得する
   * @param id 取得するユーザーのID
   * @returns ユーザーを含むPromise
   */
  async getUserById(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
    return await response.json();
  }

  /**
   * APIを介して新しいユーザーを作成する
   * @param userData 作成するユーザーデータ
   * @returns 作成されたユーザーを含むPromise
   */
  async createUser(userData: Omit<UserFormData, "id">): Promise<User> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return await response.json();
  }

  /**
   * APIを介して既存のユーザーを更新する
   * @param id 更新するユーザーのID
   * @param userData 更新されたユーザーデータ
   * @returns 更新されたユーザーを含むPromise
   */
  async updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user with ID ${id}`);
    }
    return await response.json();
  }

  /**
   * APIを介してユーザーを削除する
   * @param id 削除するユーザーのID
   */
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  }
}

// Export a singleton instance for convenience
const apiUserGateway = new ApiUserGateway();
export default apiUserGateway;
