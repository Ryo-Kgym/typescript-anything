import { User } from "@/database/entity/user";
import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * ユーザー一覧取得ユースケースのインターフェース
 */
export interface GetUsersUseCase {
  execute(): Promise<User[]>;
}

/**
 * ユーザー一覧取得ユースケースの実装
 */
export class GetUsersInteractor implements GetUsersUseCase {
  private userGateway: UserGateway;

  /**
   * コンストラクタ
   * @param userGateway 使用するユーザーゲートウェイ
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * すべてのユーザーを取得するユースケースを実行する
   * @returns ユーザーの配列を含むPromise
   */
  async execute(): Promise<User[]> {
    return await this.userGateway.getUsers();
  }
}

// Export a singleton instance for convenience
const getUsersInteractor = new GetUsersInteractor(apiUserGateway);
export default getUsersInteractor;
