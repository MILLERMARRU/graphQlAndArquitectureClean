import { Post } from '../../../domain/entities/Post';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';
import { UpdatePostDTO } from '../../dtos/CreatePostDTO';

/**
 * Caso de Uso: Actualizar Post
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de actualizar posts
 * - Dependency Inversion: Depende de IPostRepository (abstracción)
 */
export class UpdatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  /**
   * Ejecuta el caso de uso de actualización
   */
  async execute(id: string, dto: UpdatePostDTO): Promise<Post> {
    // Verificar que el post existe
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error(`Post con ID ${id} no encontrado`);
    }

    // Actualizar usando el método de la entidad
    existingPost.update(dto.title, dto.content);

    // Manejar cambio de estado de publicación
    if (dto.published !== undefined) {
      if (dto.published) {
        existingPost.publish();
      } else {
        existingPost.unpublish();
      }
    }

    // Persistir los cambios
    return await this.postRepository.update(id, existingPost);
  }
}
