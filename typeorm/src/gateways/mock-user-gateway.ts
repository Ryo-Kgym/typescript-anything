import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";
import { UserGateway } from "./user-gateway";

/**
 * Mock implementation of the User Gateway for testing
 */
export class MockUserGateway implements UserGateway {
  private users: User[] = [];
  private nextId = 1;

  /**
   * Reset the mock data
   */
  reset(): void {
    this.users = [];
    this.nextId = 1;
  }

  /**
   * Set mock users data
   * @param users The users to set
   */
  setUsers(users: User[]): void {
    this.users = [...users];
    // Update nextId to be greater than the highest ID in the users array
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    this.nextId = maxId + 1;
  }

  /**
   * Get all users
   * @returns Promise with array of users
   */
  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  /**
   * Get a user by ID
   * @param id The ID of the user to fetch
   * @returns Promise with the user
   */
  async getUserById(id: number): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return { ...user };
  }

  /**
   * Create a new user
   * @param userData The user data to create
   * @returns Promise with the created user
   */
  async createUser(userData: Omit<UserFormData, "id">): Promise<User> {
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  /**
   * Update an existing user
   * @param id The ID of the user to update
   * @param userData The updated user data
   * @returns Promise with the updated user
   */
  async updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser: User = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date()
    };
    
    this.users[index] = updatedUser;
    return { ...updatedUser };
  }

  /**
   * Delete a user
   * @param id The ID of the user to delete
   */
  async deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}