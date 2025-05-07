import { User } from "@/database/entity/user";
import { UserFormData } from "./types";
import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * Interface for the UpdateUser usecase
 */
export interface UpdateUserUseCase {
  execute(id: number, userData: Omit<UserFormData, "id">): Promise<User>;
}

/**
 * Implementation of the UpdateUser usecase
 */
export class UpdateUserInteractor implements UpdateUserUseCase {
  private userGateway: UserGateway;

  /**
   * Constructor
   * @param userGateway The user gateway to use
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * Execute the usecase to update an existing user
   * @param id The ID of the user to update
   * @param userData The updated user data
   * @returns Promise with the updated user
   */
  async execute(id: number, userData: Omit<UserFormData, "id">): Promise<User> {
    return await this.userGateway.updateUser(id, userData);
  }
}

// Export a singleton instance for convenience
const updateUserInteractor = new UpdateUserInteractor(apiUserGateway);
export default updateUserInteractor;
