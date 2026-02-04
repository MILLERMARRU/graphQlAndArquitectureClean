import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

/**
 * Caso de Uso: Obtener Usuario por ID
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de obtener un usuario por ID
 * - Dependency Inversion: Depende de IUserRepository (abstracción)
 */
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }
}
