import { IPostRepository } from '../../../domain/interfaces/IPostRepository';

/**
 * Caso de Uso: Eliminar Post
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de eliminar posts
 * - Dependency Inversion: Depende de IPostRepository (abstracción)
 */
export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  /**
   * Ejecuta el caso de uso de eliminación
   */
  async execute(id: string): Promise<boolean> {
    // Verificar que el post existe
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error(`Post con ID ${id} no encontrado`);
    }

    return await this.postRepository.delete(id);
  }
}
