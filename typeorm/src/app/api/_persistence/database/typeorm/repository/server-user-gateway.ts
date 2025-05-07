import {UserGateway} from "../../../../_core/gateways/user-gateway";
import {User} from "../../../../_core/domain/user";
import {UserFormData} from "../../../../_core/usecases/types";
import {getDataSource} from "../connection";
import {TypeOrmUser} from "./type-orm-user";

/**
 * サーバーサイドのユーザーゲートウェイ実装
 * このクラスはサーバーサイドでUserGatewayインターフェースを実装する
 */
export class ServerUserGateway implements UserGateway {
  /**
   * TypeORMのUserエンティティをコアドメインのUserに変換する
   * @param typeormUser TypeORMのUserエンティティ
   * @returns コアドメインのUser
   */
  private toCoreUser(typeormUser: TypeOrmUser): User {
    return new User(
      typeormUser.id,
      typeormUser.firstName,
      typeormUser.lastName,
      typeormUser.email,
      typeormUser.isActive,
      typeormUser.createdAt,
      typeormUser.updatedAt
    );
  }

  /**
   * コアドメインのUserからTypeORMのUserエンティティに変換するためのデータを作成する
   * @param coreUser コアドメインのUser
   * @returns TypeORMのUserエンティティに変換するためのデータ
   */
  private toTypeORMUserData(coreUser: Partial<User>): Partial<TypeOrmUser> {
    const userData: Partial<TypeOrmUser> = {};

    if (coreUser.firstName !== undefined) userData.firstName = coreUser.firstName;
    if (coreUser.lastName !== undefined) userData.lastName = coreUser.lastName;
    if (coreUser.email !== undefined) userData.email = coreUser.email;
    if (coreUser.isActive !== undefined) userData.isActive = coreUser.isActive;

    return userData;
  }
  /**
   * すべてのユーザーを取得する
   * @returns ユーザーの配列を含むPromise
   */
  async getUsers(): Promise<User[]> {
    const dataSource = await getDataSource();
    const typeormUsers = await dataSource.getRepository(TypeOrmUser).find();
    return typeormUsers.map(user => this.toCoreUser(user));
  }

  /**
   * IDによりユーザーを取得する
   * @param id 取得するユーザーのID
   * @returns ユーザーを含むPromise
   */
  async getUserById(id: number): Promise<User> {
    const dataSource = await getDataSource();
    const typeormUser = await dataSource.getRepository(TypeOrmUser).findOneBy({id});
    if (!typeormUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return this.toCoreUser(typeormUser);
  }

  /**
   * 新しいユーザーを作成する
   * @param userData 作成するユーザーデータ
   * @returns 作成されたユーザーを含むPromise
   */
  async createUser(userData: Omit<UserFormData, "id">): Promise<User> {
    const dataSource = await getDataSource();
    const typeormUserData = this.toTypeORMUserData(userData);
    const typeormUser = dataSource.getRepository(TypeOrmUser).create(typeormUserData);
    const savedTypeormUser = await dataSource.getRepository(TypeOrmUser).save(typeormUser);
    return this.toCoreUser(savedTypeormUser);
  }

  /**
   * 既存のユーザーを更新する
   * @param id 更新するユーザーのID
   * @param userData 更新されたユーザーデータ
   * @returns 更新されたユーザーを含むPromise
   */
  async updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(TypeOrmUser);
    const typeormUserData = this.toTypeORMUserData(userData);

    await userRepository.update(id, typeormUserData);

    const typeormUser = await userRepository.findOneBy({id});
    if (!typeormUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return this.toCoreUser(typeormUser);
  }

  /**
   * ユーザーを削除する
   * @param id 削除するユーザーのID
   */
  async deleteUser(id: number): Promise<void> {
    const dataSource = await getDataSource();
    const result = await dataSource.getRepository(TypeOrmUser).delete(id);
    if (!result.affected || result.affected <= 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }
}

// Export a singleton instance for convenience
export const serverUserGateway = new ServerUserGateway();
