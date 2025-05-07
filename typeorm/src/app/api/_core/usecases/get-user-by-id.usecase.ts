import { User } from "@/database/entity/user";
import { UserGateway } from "@/app/api/_core/gateways/user-gateway";

/**
 * IDによるユーザー取得ユースケースのインターフェース
 */
export interface GetUserByIdUseCase {
  execute(id: number): Promise<User>;
}

/**
 * IDによるユーザー取得ユースケースの実装
 */
export class GetUserByIdInteractor implements GetUserByIdUseCase {
  private userGateway: UserGateway;

  /**
   * コンストラクタ
   * @param userGateway 使用するユーザーゲートウェイ
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * IDによりユーザーを取得するユースケースを実行する
   * @param id 取得するユーザーのID
   * @returns ユーザーを含むPromise
   */
  async execute(id: number): Promise<User> {
    return await this.userGateway.getUserById(id);
  }
}
