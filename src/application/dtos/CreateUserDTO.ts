/**
 * Data Transfer Object para crear un Usuario
 *
 * Los DTOs encapsulan los datos que se transfieren entre capas
 * SOLID: Single Responsibility - Solo transporta datos
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  age: number;
}

/**
 * DTO para actualizar un Usuario
 */
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  age?: number;
}
