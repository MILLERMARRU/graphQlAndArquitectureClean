import { Post } from '../../../domain/entities/Post';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

/**
 * Caso de Uso: Obtener Posts por Usuario
 *
 * Este caso de uso demuestra cómo se manejan las relaciones entre entidades
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de obtener posts de un usuario específico
 * - Dependency Inversion: Depende de abstracciones
 */
export class GetPostsByUserIdUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param userId - ID del usuario
   * @param publishedOnly - Si es true, solo retorna posts publicados
   */
  async execute(userId: string, publishedOnly: boolean = false): Promise<Post[]> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`Usuario con ID ${userId} no encontrado`);
    }

    // Obtener los posts del usuario
    if (publishedOnly) {
      return await this.postRepository.findPublishedByUserId(userId);
    }
    return await this.postRepository.findByUserId(userId);
  }
}
