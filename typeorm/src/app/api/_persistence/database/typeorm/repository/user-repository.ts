import {getDataSource} from "../connection";
import {TypeOrmUser} from "../entity/type-orm-user";
import {User} from "../../../../_core/domain/user";

export class UserRepository {
    /**
     * TypeORMのUserエンティティをコアドメインのUserに変換する
     * @param typeormUser TypeORMのUserエンティティ
     * @returns コアドメインのUser
     */
    static toCoreUser(typeormUser: TypeOrmUser): User {
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
    static toTypeORMUserData(coreUser: Partial<User>): Partial<TypeOrmUser> {
        const userData: Partial<TypeOrmUser> = {};

        if (coreUser.firstName !== undefined) userData.firstName = coreUser.firstName;
        if (coreUser.lastName !== undefined) userData.lastName = coreUser.lastName;
        if (coreUser.email !== undefined) userData.email = coreUser.email;
        if (coreUser.isActive !== undefined) userData.isActive = coreUser.isActive;

        return userData;
    }

    static async findAll(): Promise<User[]> {
        const dataSource = await getDataSource();
        const typeormUsers = await dataSource.getRepository(TypeOrmUser).find();
        return typeormUsers.map(user => this.toCoreUser(user));
    }

    static async findById(id: number): Promise<User | null> {
        const dataSource = await getDataSource();
        const typeormUser = await dataSource.getRepository(TypeOrmUser).findOneBy({id});
        return typeormUser ? this.toCoreUser(typeormUser) : null;
    }

    static async create(userData: Partial<User>): Promise<User> {
        const dataSource = await getDataSource();
        const typeormUserData = this.toTypeORMUserData(userData);
        const typeormUser = dataSource.getRepository(TypeOrmUser).create(typeormUserData);
        const savedTypeormUser = await dataSource.getRepository(TypeOrmUser).save(typeormUser);
        return this.toCoreUser(savedTypeormUser);
    }

    static async update(id: number, userData: Partial<User>): Promise<User | null> {
        const dataSource = await getDataSource();
        const userRepository = dataSource.getRepository(TypeOrmUser);
        const typeormUserData = this.toTypeORMUserData(userData);

        await userRepository.update(id, typeormUserData);
        return this.findById(id);
    }

    static async delete(id: number): Promise<boolean> {
        const dataSource = await getDataSource();
        const result = await dataSource.getRepository(TypeOrmUser).delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
