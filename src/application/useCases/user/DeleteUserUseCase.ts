import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

/**
 * Caso de Uso: Eliminar Usuario
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de eliminar usuarios
 * - Dependency Inversion: Depende de IUserRepository (abstracción)
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Ejecuta el caso de uso de eliminación
   */
  async execute(id: string): Promise<boolean> {
    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    return await this.userRepository.delete(id);
  }
}
