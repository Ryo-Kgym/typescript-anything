import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUserInteractor } from '../create-user.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { UserFormData } from '../types';

describe('CreateUserInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let createUserInteractor: CreateUserInteractor;

  beforeEach(() => {
    // 各テストのためにモックゲートウェイの新しいインスタンスを作成
    mockUserGateway = new MockUserGateway();
    createUserInteractor = new CreateUserInteractor(mockUserGateway);
  });

  it('新しいユーザーを作成すること', async () => {
    // Arrange
    const userData: Omit<UserFormData, 'id'> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true
    };

    // Act
    const result = await createUserInteractor.execute(userData);

    // Assert
    expect(result).toEqual({
      id: 1, // 最初のユーザーはID 1を持つべき
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    });
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);

    // ユーザーがゲートウェイに追加されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: users[0].createdAt,
      updatedAt: users[0].updatedAt
    });
  });

  it('一意のIDを持つ複数のユーザーを作成すること', async () => {
    // Arrange
    const userData1: Omit<UserFormData, 'id'> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true
    };

    const userData2: Omit<UserFormData, 'id'> = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      isActive: true
    };

    // Act
    const result1 = await createUserInteractor.execute(userData1);
    const result2 = await createUserInteractor.execute(userData2);

    // Assert
    expect(result1).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: result1.createdAt,
      updatedAt: result1.updatedAt
    });

    expect(result2).toEqual({
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      isActive: true,
      createdAt: result2.createdAt,
      updatedAt: result2.updatedAt
    });

    // 両方のユーザーがゲートウェイに追加されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(2);
  });
});
