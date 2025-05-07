import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUserInteractor } from '../create-user.usecase';
import { MockUserGateway } from '../../gateways/mock-user-gateway';
import { UserFormData } from '../types';
import { User } from '../../domain/user';

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
    expect(result).toBeInstanceOf(User);
    expect(result).toEqual(
      new User(
        1, // 最初のユーザーはID 1を持つべき
        'John',
        'Doe',
        'john@example.com',
        true,
        result.createdAt,
        result.updatedAt
      )
    );
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);

    // ユーザーがゲートウェイに追加されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0]).toEqual(
      new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        true,
        users[0].createdAt,
        users[0].updatedAt
      )
    );
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
    expect(result1).toBeInstanceOf(User);
    expect(result1).toEqual(
      new User(
        1,
        'John',
        'Doe',
        'john@example.com',
        true,
        result1.createdAt,
        result1.updatedAt
      )
    );

    expect(result2).toBeInstanceOf(User);
    expect(result2).toEqual(
      new User(
        2,
        'Jane',
        'Smith',
        'jane@example.com',
        true,
        result2.createdAt,
        result2.updatedAt
      )
    );

    // 両方のユーザーがゲートウェイに追加されたことを確認
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(2);
  });
});
