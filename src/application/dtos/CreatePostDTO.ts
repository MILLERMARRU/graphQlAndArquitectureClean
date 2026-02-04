/**
 * Data Transfer Object para crear un Post
 *
 * Los DTOs encapsulan los datos que se transfieren entre capas
 * SOLID: Single Responsibility - Solo transporta datos
 */
export interface CreatePostDTO {
  title: string;
  content: string;
  userId: string;
  published?: boolean;
}

/**
 * DTO para actualizar un Post
 */
export interface UpdatePostDTO {
  title?: string;
  content?: string;
  published?: boolean;
}
