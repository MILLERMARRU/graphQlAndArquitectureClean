import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de Uso: Crear Usuario
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de la lógica de creación de usuarios
 * - Dependency Inversion: Depende de la abstracción IUserRepository, no de la implementación
 * - Open/Closed: Abierto a extensión (se puede heredar), cerrado a modificación
 *
 * Este patrón permite:
 * 1. Centralizar la lógica de negocio
 * 2. Facilitar el testing
 * 3. Reutilizar la lógica en diferentes contextos (REST, GraphQL, CLI, etc.)
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Ejecuta el caso de uso de creación de usuario
   */
  async execute(dto: CreateUserDTO): Promise<User> {
    // Validar que el email no esté duplicado
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error(`El email ${dto.email} ya está registrado`);
    }

    // Crear la entidad de dominio
    const now = new Date();
    const user = new User(
      uuidv4(), // Generar ID único
      dto.name,
      dto.email,
      dto.age,
      now,
      now
    );

    // Persistir en el repositorio
    return await this.userRepository.create(user);
  }
}
