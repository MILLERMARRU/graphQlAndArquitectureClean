import { Post } from '../../../domain/entities/Post';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';

/**
 * Caso de Uso: Obtener Post por ID
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de obtener un post por ID
 * - Dependency Inversion: Depende de IPostRepository (abstracción)
 */
export class GetPostByIdUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error(`Post con ID ${id} no encontrado`);
    }

    return post;
  }
}
