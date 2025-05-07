import { User } from "@/database/entity/user";
import { UserFormData } from "./types";
import { UserGateway } from "@/gateways/user-gateway";
import apiUserGateway from "@/gateways/api-user-gateway";

/**
 * Interface for the CreateUser usecase
 */
export interface CreateUserUseCase {
  execute(userData: Omit<UserFormData, "id">): Promise<User>;
}

/**
 * Implementation of the CreateUser usecase
 */
export class CreateUserInteractor implements CreateUserUseCase {
  private userGateway: UserGateway;

  /**
   * Constructor
   * @param userGateway The user gateway to use
   */
  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  /**
   * Execute the usecase to create a new user
   * @param userData The user data to create
   * @returns Promise with the created user
   */
  async execute(userData: Omit<UserFormData, "id">): Promise<User> {
    return await this.userGateway.createUser(userData);
  }
}

// Export a singleton instance for convenience
const createUserInteractor = new CreateUserInteractor(apiUserGateway);
export default createUserInteractor;
