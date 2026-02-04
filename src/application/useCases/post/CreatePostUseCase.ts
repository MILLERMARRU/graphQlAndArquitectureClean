import { Post } from '../../../domain/entities/Post';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { CreatePostDTO } from '../../dtos/CreatePostDTO';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de Uso: Crear Post
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de la lógica de creación de posts
 * - Dependency Inversion: Depende de abstracciones (IPostRepository, IUserRepository)
 */
export class CreatePostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Ejecuta el caso de uso de creación de post
   */
  async execute(dto: CreatePostDTO): Promise<Post> {
    // Validar que el usuario existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error(`Usuario con ID ${dto.userId} no encontrado`);
    }

    // Crear la entidad de dominio
    const now = new Date();
    const post = new Post(
      uuidv4(),
      dto.title,
      dto.content,
      dto.userId,
      dto.published || false,
      now,
      now
    );

    // Persistir en el repositorio
    return await this.postRepository.create(post);
  }
}
