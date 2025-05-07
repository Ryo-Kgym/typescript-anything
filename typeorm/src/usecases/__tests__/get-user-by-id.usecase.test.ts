import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserByIdInteractor } from '../get-user-by-id.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { User } from '@/database/entity/user';

describe('GetUserByIdInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let getUserByIdInteractor: GetUserByIdInteractor;

  beforeEach(() => {
    // Create a new instance of the mock gateway for each test
    mockUserGateway = new MockUserGateway();
    getUserByIdInteractor = new GetUserByIdInteractor(mockUserGateway);
  });

  it('should return a user when the user exists', async () => {
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
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw an error when the user does not exist', async () => {
    // Arrange
    mockUserGateway.reset();

    // Act & Assert
    await expect(getUserByIdInteractor.execute(999)).rejects.toThrow('User with ID 999 not found');
  });
});