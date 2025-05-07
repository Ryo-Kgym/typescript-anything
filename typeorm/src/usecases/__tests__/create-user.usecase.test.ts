import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUserInteractor } from '../create-user.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { UserFormData } from '../types';

describe('CreateUserInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let createUserInteractor: CreateUserInteractor;

  beforeEach(() => {
    // Create a new instance of the mock gateway for each test
    mockUserGateway = new MockUserGateway();
    createUserInteractor = new CreateUserInteractor(mockUserGateway);
  });

  it('should create a new user', async () => {
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
    expect(result).toBeDefined();
    expect(result.id).toBe(1); // First user should have ID 1
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.isActive).toBe(true);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);

    // Verify the user was added to the gateway
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(1);
  });

  it('should create multiple users with unique IDs', async () => {
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
    expect(result1.id).toBe(1);
    expect(result2.id).toBe(2);

    // Verify both users were added to the gateway
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(2);
  });
});