import { User } from "@/database/entity/user";
import { UserFormData } from "@/usecases/types";
import { UserGateway } from "./user-gateway";

/**
 * API implementation of the User Gateway
 * This class handles all API calls related to users
 */
export class ApiUserGateway implements UserGateway {
  /**
   * Get all users from the API
   * @returns Promise with array of users
   */
  async getUsers(): Promise<User[]> {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  }

  /**
   * Get a user by ID from the API
   * @param id The ID of the user to fetch
   * @returns Promise with the user
   */
  async getUserById(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
    return await response.json();
  }

  /**
   * Create a new user via the API
   * @param userData The user data to create
   * @returns Promise with the created user
   */
  async createUser(userData: Omit<UserFormData, "id">): Promise<User> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return await response.json();
  }

  /**
   * Update an existing user via the API
   * @param id The ID of the user to update
   * @param userData The updated user data
   * @returns Promise with the updated user
   */
  async updateUser(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user with ID ${id}`);
    }
    return await response.json();
  }

  /**
   * Delete a user via the API
   * @param id The ID of the user to delete
   */
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  }
}

// Export a singleton instance for convenience
const apiUserGateway = new ApiUserGateway();
export default apiUserGateway;