import { Repository } from 'typeorm';
import { Post } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { PostModel } from '../database/models/PostModel';
import { AppDataSource } from '../../config/database';

/**
 * Implementación concreta del repositorio de posts usando TypeORM
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de la persistencia de posts
 * - Dependency Inversion: Implementa la interfaz IPostRepository del dominio
 * - Liskov Substitution: Puede ser sustituido por cualquier otra implementación de IPostRepository
 *
 * Este adaptador convierte entre:
 * - Entidad de Dominio (Post) <-> Modelo de Persistencia (PostModel)
 */
export class PostRepository implements IPostRepository {
  private repository: Repository<PostModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(PostModel);
  }

  /**
   * Convierte un PostModel a una entidad Post del dominio
   */
  private toDomain(model: PostModel): Post {
    return new Post(
      model.id,
      model.title,
      model.content,
      model.userId,
      model.published,
      model.createdAt,
      model.updatedAt
    );
  }

  /**
   * Convierte una entidad Post del dominio a PostModel
   */
  private toModel(post: Post): PostModel {
    const model = new PostModel();
    model.id = post.id;
    model.title = post.title;
    model.content = post.content;
    model.userId = post.userId;
    model.published = post.published;
    model.createdAt = post.createdAt;
    model.updatedAt = post.updatedAt;
    return model;
  }

  async create(post: Post): Promise<Post> {
    const model = this.toModel(post);
    const savedModel = await this.repository.save(model);
    return this.toDomain(savedModel);
  }

  async findById(id: string): Promise<Post | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? this.toDomain(model) : null;
  }

  async findAll(): Promise<Post[]> {
    const models = await this.repository.find({ order: { createdAt: 'DESC' } });
    return models.map((model) => this.toDomain(model));
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const models = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return models.map((model) => this.toDomain(model));
  }

  async findPublished(): Promise<Post[]> {
    const models = await this.repository.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
    });
    return models.map((model) => this.toDomain(model));
  }

  async findPublishedByUserId(userId: string): Promise<Post[]> {
    const models = await this.repository.find({
      where: { userId, published: true },
      order: { createdAt: 'DESC' },
    });
    return models.map((model) => this.toDomain(model));
  }

  async update(id: string, post: Partial<Post>): Promise<Post> {
    await this.repository.update(id, post as any);
    const updatedModel = await this.repository.findOne({ where: { id } });
    if (!updatedModel) {
      throw new Error(`Post con ID ${id} no encontrado después de actualizar`);
    }
    return this.toDomain(updatedModel);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({ where: { userId } });
  }
}
