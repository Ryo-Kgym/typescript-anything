import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * Interface for the DeleteUser usecase
 */
export interface DeleteUserUseCase {
  execute(id: number): Promise<void>;
}

/**
 * Implementation of the DeleteUser usecase
 */
export class DeleteUserInteractor implements DeleteUserUseCase {
  private userGateway: UserGateway;

  /**
   * Constructor
   * @param userGateway The user gateway to use
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * Execute the usecase to delete a user
   * @param id The ID of the user to delete
   */
  async execute(id: number): Promise<void> {
    await this.userGateway.deleteUser(id);
  }
}

// Export a singleton instance for convenience
const deleteUserInteractor = new DeleteUserInteractor(apiUserGateway);
export default deleteUserInteractor;
