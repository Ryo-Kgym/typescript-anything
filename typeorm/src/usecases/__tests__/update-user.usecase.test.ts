import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateUserInteractor } from '../update-user.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { User } from '@/database/entity/user';
import { UserFormData } from '../types';

describe('UpdateUserInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let updateUserInteractor: UpdateUserInteractor;
  let existingUser: User;

  beforeEach(() => {
    // Create a new instance of the mock gateway for each test
    mockUserGateway = new MockUserGateway();
    updateUserInteractor = new UpdateUserInteractor(mockUserGateway);

    // Create an existing user for testing
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

  it('should update an existing user', async () => {
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
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.firstName).toBe('Johnny');
    expect(result.lastName).toBe('Updated');
    expect(result.email).toBe('johnny.updated@example.com');
    expect(result.isActive).toBe(true);
    
    // Verify the user was updated in the gateway
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].firstName).toBe('Johnny');
    expect(users[0].lastName).toBe('Updated');
  });

  it('should only update the provided fields', async () => {
    // Arrange
    const updateData: Omit<UserFormData, 'id'> = {
      firstName: 'Johnny',
      lastName: 'Doe', // Same as before
      email: 'john@example.com', // Same as before
      isActive: true // Same as before
    };

    // Act
    const result = await updateUserInteractor.execute(1, updateData);

    // Assert
    expect(result.firstName).toBe('Johnny');
    expect(result.lastName).toBe('Doe');
    expect(result.email).toBe('john@example.com');
    
    // Verify only firstName was updated in the gateway
    const users = await mockUserGateway.getUsers();
    expect(users[0].firstName).toBe('Johnny');
    expect(users[0].lastName).toBe('Doe');
  });

  it('should throw an error when the user does not exist', async () => {
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