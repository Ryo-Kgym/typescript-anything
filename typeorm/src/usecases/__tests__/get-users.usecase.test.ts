import { describe, it, expect, beforeEach } from 'vitest';
import { GetUsersInteractor } from '../get-users.usecase';
import { MockUserGateway } from '@/gateways/mock-user-gateway';
import { User } from '@/database/entity/user';

describe('GetUsersInteractor', () => {
  let mockUserGateway: MockUserGateway;
  let getUsersInteractor: GetUsersInteractor;

  beforeEach(() => {
    // Create a new instance of the mock gateway for each test
    mockUserGateway = new MockUserGateway();
    getUsersInteractor = new GetUsersInteractor(mockUserGateway);
  });

  it('should return an empty array when there are no users', async () => {
    // Arrange
    mockUserGateway.reset();

    // Act
    const result = await getUsersInteractor.execute();

    // Assert
    expect(result).toEqual([]);
  });

  it('should return all users', async () => {
    // Arrange
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    mockUserGateway.setUsers(mockUsers);

    // Act
    const result = await getUsersInteractor.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[0].firstName).toBe('John');
    expect(result[1].id).toBe(2);
    expect(result[1].firstName).toBe('Jane');
  });
});