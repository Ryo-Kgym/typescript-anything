import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateUserInteractor } from '../update-user.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { User } from '../../domain/user';
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
    expect(result).toBeInstanceOf(User);
    expect(result).toEqual(
      new User(
        1,
        'Johnny',
        'Updated',
        'johnny.updated@example.com',
        true,
        result.createdAt,
        result.updatedAt
      )
    );

    // ユーザーがゲートウェイで更新されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0]).toEqual(
      new User(
        1,
        'Johnny',
        'Updated',
        'johnny.updated@example.com',
        true,
        users[0].createdAt,
        users[0].updatedAt
      )
    );
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
    expect(result).toBeInstanceOf(User);
    expect(result).toEqual(
      new User(
        1,
        'Johnny',
        'Doe',
        'john@example.com',
        true,
        result.createdAt,
        result.updatedAt
      )
    );

    // firstNameのみがゲートウェイで更新されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0]).toEqual(
      new User(
        1,
        'Johnny',
        'Doe',
        'john@example.com',
        true,
        users[0].createdAt,
        users[0].updatedAt
      )
    );
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
