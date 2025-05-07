import { describe, it, expect, beforeEach } from 'vitest';
import { GetUsersInteractor } from '../get-users.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { User } from '../../domain/user';

describe('GetUsersInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let getUsersInteractor: GetUsersInteractor;

  beforeEach(() => {
    // 各テストのためにモックゲートウェイの新しいインスタンスを作成
    mockUserGateway = new MockUserGateway();
    getUsersInteractor = new GetUsersInteractor(mockUserGateway);
  });

  it('ユーザーが存在しない場合、空の配列を返すこと', async () => {
    // Arrange
    mockUserGateway.reset();

    // Act
    const result = await getUsersInteractor.execute();

    // Assert
    expect(result).toEqual([]);
  });

  it('すべてのユーザーを返すこと', async () => {
    // Arrange
    const createdAt1 = new Date();
    const updatedAt1 = new Date();
    const createdAt2 = new Date();
    const updatedAt2 = new Date();

    const mockUsers: User[] = [
      new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        true,
        createdAt1,
        updatedAt1
      ),
      new User(
        2,
        'Jane',
        'Smith',
        'jane@example.com',
        true,
        createdAt2,
        updatedAt2
      )
    ];
    mockUserGateway.setUsers(mockUsers);

    // Act
    const result = await getUsersInteractor.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(User);
    expect(result[0]).toEqual(
      new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        true,
        result[0].createdAt,
        result[0].updatedAt
      )
    );
    expect(result[1]).toBeInstanceOf(User);
    expect(result[1]).toEqual(
      new User(
        2,
        'Jane',
        'Smith',
        'jane@example.com',
        true,
        result[1].createdAt,
        result[1].updatedAt
      )
    );
  });
});
