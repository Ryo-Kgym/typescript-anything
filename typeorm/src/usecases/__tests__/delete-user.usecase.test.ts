import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteUserInteractor } from '../delete-user.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { User } from '@/database/entity/user';

describe('DeleteUserInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let deleteUserInteractor: DeleteUserInteractor;
  let existingUser: User;

  beforeEach(() => {
    // Create a new instance of the mock gateway for each test
    mockUserGateway = new MockUserGateway();
    deleteUserInteractor = new DeleteUserInteractor(mockUserGateway);

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

  it('should delete an existing user', async () => {
    // Arrange
    const initialUsers = await mockUserGateway.getUsers();
    expect(initialUsers).toHaveLength(1);

    // Act
    await deleteUserInteractor.execute(1);

    // Assert
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(0);
  });

  it('should throw an error when the user does not exist', async () => {
    // Act & Assert
    await expect(deleteUserInteractor.execute(999)).rejects.toThrow('User with ID 999 not found');
  });

  it('should only delete the specified user', async () => {
    // Arrange
    const secondUser: User = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUserGateway.setUsers([existingUser, secondUser]);
    
    const initialUsers = await mockUserGateway.getUsers();
    expect(initialUsers).toHaveLength(2);

    // Act
    await deleteUserInteractor.execute(1);

    // Assert
    const users = await mockUserGateway.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(2);
    expect(users[0].firstName).toBe('Jane');
  });
});