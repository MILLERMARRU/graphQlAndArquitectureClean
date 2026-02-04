import { User } from '../entities/User';

/**
 * Interface para el Repositorio de Usuarios
 *
 * SOLID Principles:
 * - Dependency Inversion: Las capas superiores dependen de esta abstracción,
 *   no de la implementación concreta del repositorio
 * - Interface Segregation: Define solo los métodos necesarios para User
 * - Single Responsibility: Solo define el contrato para operaciones de User
 *
 * Esta interface permite:
 * 1. Desacoplar la lógica de negocio de la implementación de persistencia
 * 2. Facilitar testing con mocks
 * 3. Cambiar fácilmente de implementación (MySQL, MongoDB, PostgreSQL, etc.)
 */
export interface IUserRepository {
  /**
   * Crea un nuevo usuario
   */
  create(user: User): Promise<User>;

  /**
   * Encuentra un usuario por su ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Encuentra un usuario por su email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Obtiene todos los usuarios
   */
  findAll(): Promise<User[]>;

  /**
   * Actualiza un usuario existente
   */
  update(id: string, user: Partial<User>): Promise<User>;

  /**
   * Elimina un usuario
   */
  delete(id: string): Promise<boolean>;

  /**
   * Verifica si existe un usuario con el email dado
   */
  existsByEmail(email: string): Promise<boolean>;
}
