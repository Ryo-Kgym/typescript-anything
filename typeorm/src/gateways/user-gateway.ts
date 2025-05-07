import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";

/**
 * Interface for the User Gateway
 * This defines the contract for accessing user data
 */
export interface UserGateway {
  /**
   * Get all users
   * @returns Promise with array of users
   */
  getUsers(): Promise<User[]>;
  
  /**
   * Get a user by ID
   * @param id The ID of the user to fetch
   * @returns Promise with the user
   */
  getUserById(id: number): Promise<User>;
  
  /**
   * Create a new user
   * @param userData The user data to create
   * @returns Promise with the created user
   */
  createUser(userData: Omit<UserFormData, "id">): Promise<User>;
  
  /**
   * Update an existing user
   * @param id The ID of the user to update
   * @param userData The updated user data
   * @returns Promise with the updated user
   */
  updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User>;
  
  /**
   * Delete a user
   * @param id The ID of the user to delete
   */
  deleteUser(id: number): Promise<void>;
}