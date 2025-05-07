import { User } from "@/database/entity/user";
import { UserFormData } from "./types";
import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * ユーザー作成ユースケースのインターフェース
 */
export interface CreateUserUseCase {
  execute(userData: Omit<UserFormData, "id">): Promise<User>;
}

/**
 * ユーザー作成ユースケースの実装
 */
export class CreateUserInteractor implements CreateUserUseCase {
  private userGateway: UserGateway;

  /**
   * コンストラクタ
   * @param userGateway 使用するユーザーゲートウェイ
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * 新しいユーザーを作成するユースケースを実行する
   * @param userData 作成するユーザーデータ
   * @returns 作成されたユーザーを含むPromise
   */
  async execute(userData: Omit<UserFormData, "id">): Promise<User> {
    return await this.userGateway.createUser(userData);
  }
}

// Export a singleton instance for convenience
const createUserInteractor = new CreateUserInteractor(apiUserGateway);
export default createUserInteractor;
