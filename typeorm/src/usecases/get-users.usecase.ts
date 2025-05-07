import { User } from "@/database/entity/user";
import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * Interface for the GetUsers usecase
 */
export interface GetUsersUseCase {
  execute(): Promise<User[]>;
}

/**
 * Implementation of the GetUsers usecase
 */
export class GetUsersInteractor implements GetUsersUseCase {
  private userGateway: UserGateway;

  /**
   * Constructor
   * @param userGateway The user gateway to use
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * Execute the usecase to get all users
   * @returns Promise with array of users
   */
  async execute(): Promise<User[]> {
    return await this.userGateway.getUsers();
  }
}

// Export a singleton instance for convenience
const getUsersInteractor = new GetUsersInteractor(apiUserGateway);
export default getUsersInteractor;
