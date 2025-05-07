import { User } from "@/database/entity/user";
import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * Interface for the GetUserById usecase
 */
export interface GetUserByIdUseCase {
  execute(id: number): Promise<User>;
}

/**
 * Implementation of the GetUserById usecase
 */
export class GetUserByIdInteractor implements GetUserByIdUseCase {
  private userGateway: UserGateway;

  /**
   * Constructor
   * @param userGateway The user gateway to use
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * Execute the usecase to get a user by ID
   * @param id The ID of the user to fetch
   * @returns Promise with the user
   */
  async execute(id: number): Promise<User> {
    return await this.userGateway.getUserById(id);
  }
}

// Export a singleton instance for convenience
const getUserByIdInteractor = new GetUserByIdInteractor(apiUserGateway);
export default getUserByIdInteractor;
