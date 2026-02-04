import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UpdateUserDTO } from '../../dtos/CreateUserDTO';

/**
 * Caso de Uso: Actualizar Usuario
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de actualizar usuarios
 * - Dependency Inversion: Depende de IUserRepository (abstracción)
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Ejecuta el caso de uso de actualización
   */
  async execute(id: string, dto: UpdateUserDTO): Promise<User> {
    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    // Si se actualiza el email, verificar que no esté duplicado
    if (dto.email && dto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(dto.email);
      if (userWithEmail) {
        throw new Error(`El email ${dto.email} ya está registrado`);
      }
    }

    // Actualizar usando el método de la entidad
    existingUser.update(dto.name, dto.email, dto.age);

    // Persistir los cambios
    return await this.userRepository.update(id, existingUser);
  }
}
