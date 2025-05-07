import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserByIdInteractor } from '../get-user-by-id.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { User } from '../../domain/user';

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
    const createdAt = new Date();
    const updatedAt = new Date();
    const mockUser = new User(
      1,
      'John',
      'Doe',
      'john@example.com',
      true,
      createdAt,
      updatedAt
    );
    mockUserGateway.setUsers([mockUser]);

    // Act
    const result = await getUserByIdInteractor.execute(1);

    // Assert
    expect(result).toBeInstanceOf(User);
    expect(result).toEqual(
      new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        true,
        result.createdAt,
        result.updatedAt
      )
    );
  });

  it('ユーザーが存在しない場合、エラーをスローすること', async () => {
    // Arrange
    mockUserGateway.reset();

    // Act & Assert
    await expect(getUserByIdInteractor.execute(999)).rejects.toThrow('User with ID 999 not found');
  });
});
