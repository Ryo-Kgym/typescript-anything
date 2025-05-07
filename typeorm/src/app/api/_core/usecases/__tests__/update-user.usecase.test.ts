import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateUserInteractor } from '../update-user.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { User } from '../../../database/entity/user';
import { UserFormData } from '../types';

describe('UpdateUserInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let updateUserInteractor: UpdateUserInteractor;
  let existingUser: User;

  beforeEach(() => {
    // 各テストのためにモックゲートウェイの新しいインスタンスを作成
    mockUserGateway = new MockUserGateway();
    updateUserInteractor = new UpdateUserInteractor(mockUserGateway);

    // テスト用の既存ユーザーを作成
    const now = new Date();
    existingUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    mockUserGateway.setUsers([existingUser]);
  });

  it('既存のユーザーを更新すること', async () => {
    // Arrange
    const updateData: Omit<UserFormData, 'id'> = {
      firstName: 'Johnny',
      lastName: 'Updated',
      email: 'johnny.updated@example.com',
      isActive: true
    };

    // Act
    const result = await updateUserInteractor.execute(1, updateData);

    // Assert
    expect(result).toEqual({
      id: 1,
      firstName: 'Johnny',
      lastName: 'Updated',
      email: 'johnny.updated@example.com',
      isActive: true,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    });

    // ユーザーがゲートウェイで更新されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      id: 1,
      firstName: 'Johnny',
      lastName: 'Updated',
      email: 'johnny.updated@example.com',
      isActive: true,
      createdAt: users[0].createdAt,
      updatedAt: users[0].updatedAt
    });
  });

  it('提供されたフィールドのみを更新すること', async () => {
    // Arrange
    const updateData: Omit<UserFormData, 'id'> = {
      firstName: 'Johnny',
      lastName: 'Doe', // 以前と同じ
      email: 'john@example.com', // 以前と同じ
      isActive: true // 以前と同じ
    };

    // Act
    const result = await updateUserInteractor.execute(1, updateData);

    // Assert
    expect(result).toEqual({
      id: 1,
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    });

    // firstNameのみがゲートウェイで更新されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users[0]).toEqual({
      id: 1,
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: users[0].createdAt,
      updatedAt: users[0].updatedAt
    });
  });

  it('ユーザーが存在しない場合、エラーをスローすること', async () => {
    // Arrange
    const updateData: Omit<UserFormData, 'id'> = {
      firstName: 'Johnny',
      lastName: 'Updated',
      email: 'johnny.updated@example.com',
      isActive: true
    };

    // Act & Assert
    await expect(updateUserInteractor.execute(999, updateData)).rejects.toThrow('User with ID 999 not found');
  });
});
