import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteUserInteractor } from '../delete-user.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { User } from '../../domain/user';

describe('DeleteUserInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let deleteUserInteractor: DeleteUserInteractor;
  let existingUser: User;

  beforeEach(() => {
    // 各テストのためにモックゲートウェイの新しいインスタンスを作成
    mockUserGateway = new MockUserGateway();
    deleteUserInteractor = new DeleteUserInteractor(mockUserGateway);

    // テスト用の既存ユーザーを作成
    const now = new Date();
    existingUser = new User(
      1,
      'John',
      'Doe',
      'john@example.com',
      true,
      now,
      now
    );
    mockUserGateway.setUsers([existingUser]);
  });

  it('既存のユーザーを削除すること', async () => {
    // Arrange
    const initialUsers = await mockUserGateway.getUsers();
    expect(initialUsers).toHaveLength(1);

    // Act
    await deleteUserInteractor.execute(1);

    // Assert
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(0);
  });

  it('ユーザーが存在しない場合、エラーをスローすること', async () => {
    // Act & Assert
    await expect(deleteUserInteractor.execute(999)).rejects.toThrow('User with ID 999 not found');
  });

  it('指定されたユーザーのみを削除すること', async () => {
    // Arrange
    const createdAt = new Date();
    const updatedAt = new Date();
    const secondUser = new User(
      2,
      'Jane',
      'Smith',
      'jane@example.com',
      true,
      createdAt,
      updatedAt
    );
    mockUserGateway.setUsers([existingUser, secondUser]);

    const initialUsers = await mockUserGateway.getUsers();
    expect(initialUsers).toHaveLength(2);

    // Act
    await deleteUserInteractor.execute(1);

    // Assert
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0]).toEqual(
      new User(
        2,
        'Jane',
        'Smith',
        'jane@example.com',
        true,
        users[0].createdAt,
        users[0].updatedAt
      )
    );
  });
});
