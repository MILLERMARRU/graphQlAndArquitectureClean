import { Post } from '../../../domain/entities/Post';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';

/**
 * Caso de Uso: Obtener Todos los Posts
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de obtener todos los posts
 * - Dependency Inversion: Depende de IPostRepository (abstracción)
 */
export class GetAllPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param publishedOnly - Si es true, solo retorna posts publicados
   */
  async execute(publishedOnly: boolean = false): Promise<Post[]> {
    if (publishedOnly) {
      return await this.postRepository.findPublished();
    }
    return await this.postRepository.findAll();
  }
}
