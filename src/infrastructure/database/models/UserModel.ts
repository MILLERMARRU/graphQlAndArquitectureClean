import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PostModel } from './PostModel';

/**
 * Modelo de TypeORM para la tabla Users
 *
 * Este es el modelo de persistencia (infraestructura), separado de la entidad de dominio.
 * Esto permite cambiar el ORM sin afectar la lógica de negocio.
 *
 * SOLID Principles:
 * - Single Responsibility: Solo define la estructura de la tabla
 * - Dependency Inversion: La entidad de dominio no depende de este modelo
 */
@Entity('users')
export class UserModel {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255, unique: true })
  email!: string;

  @Column('int')
  age!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relación uno a muchos con Posts
  @OneToMany(() => PostModel, (post) => post.user)
  posts!: PostModel[];
}
