import { getDataSource } from "../connection";
import { User } from "../entity/user";

export class UserRepository {
  static async findAll(): Promise<User[]> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(User).find();
  }

  static async findById(id: number): Promise<User | null> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(User).findOneBy({ id });
  }

  static async create(userData: Partial<User>): Promise<User> {
    const dataSource = await getDataSource();
    const user = dataSource.getRepository(User).create(userData);
    return dataSource.getRepository(User).save(user);
  }

  static async update(id: number, userData: Partial<User>): Promise<User | null> {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    
    await userRepository.update(id, userData);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const dataSource = await getDataSource();
    const result = await dataSource.getRepository(User).delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}