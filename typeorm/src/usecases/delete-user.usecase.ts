import { UserGateway } from "@/gateways/user-gateway";

/**
 * ユーザー削除ユースケースのインターフェース
 */
export interface DeleteUserUseCase {
  execute(id: number): Promise<void>;
}

/**
 * ユーザー削除ユースケースの実装
 */
export class DeleteUserInteractor implements DeleteUserUseCase {
  private userGateway: UserGateway;

  /**
   * コンストラクタ
   * @param userGateway 使用するユーザーゲートウェイ
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * ユーザーを削除するユースケースを実行する
   * @param id 削除するユーザーのID
   */
  async execute(id: number): Promise<void> {
    await this.userGateway.deleteUser(id);
  }
}

