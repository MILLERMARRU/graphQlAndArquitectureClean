import { Repository } from 'typeorm';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserModel } from '../database/models/UserModel';
import { AppDataSource } from '../../config/database';

/**
 * Implementación concreta del repositorio de usuarios usando TypeORM
 *
 * SOLID Principles:
 * - Single Responsibility: Solo se encarga de la persistencia de usuarios
 * - Dependency Inversion: Implementa la interfaz IUserRepository del dominio
 * - Liskov Substitution: Puede ser sustituido por cualquier otra implementación de IUserRepository
 *
 * Este adaptador convierte entre:
 * - Entidad de Dominio (User) <-> Modelo de Persistencia (UserModel)
 */
export class UserRepository implements IUserRepository {
  private repository: Repository<UserModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserModel);
  }

  /**
   * Convierte un UserModel a una entidad User del dominio
   */
  private toDomain(model: UserModel): User {
    return new User(model.id, model.name, model.email, model.age, model.createdAt, model.updatedAt);
  }

  /**
   * Convierte una entidad User del dominio a UserModel
   */
  private toModel(user: User): UserModel {
    const model = new UserModel();
    model.id = user.id;
    model.name = user.name;
    model.email = user.email;
    model.age = user.age;
    model.createdAt = user.createdAt;
    model.updatedAt = user.updatedAt;
    return model;
  }

  async create(user: User): Promise<User> {
    const model = this.toModel(user);
    const savedModel = await this.repository.save(model);
    return this.toDomain(savedModel);
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? this.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { email } });
    return model ? this.toDomain(model) : null;
  }

  async findAll(): Promise<User[]> {
    const models = await this.repository.find({ order: { createdAt: 'DESC' } });
    return models.map((model) => this.toDomain(model));
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user as any);
    const updatedModel = await this.repository.findOne({ where: { id } });
    if (!updatedModel) {
      throw new Error(`Usuario con ID ${id} no encontrado después de actualizar`);
    }
    return this.toDomain(updatedModel);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}
