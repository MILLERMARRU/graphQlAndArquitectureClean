import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

/**
 * Caso de Uso: Obtener Todos los Usuarios
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de obtener todos los usuarios
 * - Dependency Inversion: Depende de IUserRepository (abstracción)
 */
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
