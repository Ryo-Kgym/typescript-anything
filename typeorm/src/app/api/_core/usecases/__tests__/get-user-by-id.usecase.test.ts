import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserByIdInteractor } from '../get-user-by-id.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { User } from '../../../database/entity/user';

describe('GetUserByIdInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let getUserByIdInteractor: GetUserByIdInteractor;

  beforeEach(() => {
    // 各テストのためにモックゲートウェイの新しいインスタンスを作成
    mockUserGateway = new MockUserGateway();
    getUserByIdInteractor = new GetUserByIdInteractor(mockUserGateway);
  });

  it('ユーザーが存在する場合、ユーザーを返すこと', async () => {
    // Arrange
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUserGateway.setUsers([mockUser]);

    // Act
    const result = await getUserByIdInteractor.execute(1);

    // Assert
    expect(result).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    });
  });

  it('ユーザーが存在しない場合、エラーをスローすること', async () => {
    // Arrange
    mockUserGateway.reset();

    // Act & Assert
    await expect(getUserByIdInteractor.execute(999)).rejects.toThrow('User with ID 999 not found');
  });
});
