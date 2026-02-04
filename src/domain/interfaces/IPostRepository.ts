import { Post } from '../entities/Post';

/**
 * Interface para el Repositorio de Posts
 *
 * SOLID Principles:
 * - Dependency Inversion: Las capas superiores dependen de esta abstracción
 * - Interface Segregation: Define solo los métodos necesarios para Post
 * - Single Responsibility: Solo define el contrato para operaciones de Post
 *
 * Esta interface permite:
 * 1. Desacoplar la lógica de negocio de la implementación de persistencia
 * 2. Facilitar testing con mocks
 * 3. Cambiar fácilmente de implementación
 */
export interface IPostRepository {
  /**
   * Crea un nuevo post
   */
  create(post: Post): Promise<Post>;

  /**
   * Encuentra un post por su ID
   */
  findById(id: string): Promise<Post | null>;

  /**
   * Obtiene todos los posts
   */
  findAll(): Promise<Post[]>;

  /**
   * Obtiene todos los posts de un usuario específico
   */
  findByUserId(userId: string): Promise<Post[]>;

  /**
   * Obtiene solo los posts publicados
   */
  findPublished(): Promise<Post[]>;

  /**
   * Obtiene los posts publicados de un usuario específico
   */
  findPublishedByUserId(userId: string): Promise<Post[]>;

  /**
   * Actualiza un post existente
   */
  update(id: string, post: Partial<Post>): Promise<Post>;

  /**
   * Elimina un post
   */
  delete(id: string): Promise<boolean>;

  /**
   * Cuenta el número de posts de un usuario
   */
  countByUserId(userId: string): Promise<number>;
}
