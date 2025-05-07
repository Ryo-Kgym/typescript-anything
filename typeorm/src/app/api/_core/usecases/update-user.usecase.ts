import { User } from "../../database/entity/user";
import { UserFormData } from "./types";
import { UserGateway } from "../gateways/user-gateway";

/**
 * ユーザー更新ユースケースのインターフェース
 */
export interface UpdateUserUseCase {
  execute(id: number, userData: Omit<UserFormData, "id">): Promise<User>;
}

/**
 * ユーザー更新ユースケースの実装
 */
export class UpdateUserInteractor implements UpdateUserUseCase {
  private userGateway: UserGateway;

  /**
   * コンストラクタ
   * @param userGateway 使用するユーザーゲートウェイ
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * 既存のユーザーを更新するユースケースを実行する
   * @param id 更新するユーザーのID
   * @param userData 更新されたユーザーデータ
   * @returns 更新されたユーザーを含むPromise
   */
  async execute(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    return await this.userGateway.updateUser(id, userData);
  }
}
