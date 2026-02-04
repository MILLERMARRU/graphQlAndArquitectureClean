import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from './UserModel';

/**
 * Modelo de TypeORM para la tabla Posts
 *
 * Este es el modelo de persistencia (infraestructura), separado de la entidad de dominio.
 *
 * SOLID Principles:
 * - Single Responsibility: Solo define la estructura de la tabla
 * - Dependency Inversion: La entidad de dominio no depende de este modelo
 */
@Entity('posts')
export class PostModel {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { length: 200 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('varchar', { length: 36, name: 'user_id' })
  userId!: string;

  @Column('boolean', { default: false })
  published!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relación muchos a uno con User
  @ManyToOne(() => UserModel, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserModel;
}
