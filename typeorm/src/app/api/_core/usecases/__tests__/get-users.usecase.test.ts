import { describe, it, expect, beforeEach } from 'vitest';
import { GetUsersInteractor } from '../get-users.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { User } from '@/database/entity/user';

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
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    mockUserGateway.setUsers(mockUsers);

    // Act
    const result = await getUsersInteractor.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt
    });
    expect(result[1]).toEqual({
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      isActive: true,
      createdAt: result[1].createdAt,
      updatedAt: result[1].updatedAt
    });
  });
});
