/**
 * Errores personalizados de la aplicación
 *
 * SOLID: Single Responsibility - Cada clase de error tiene un propósito específico
 */

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} con ID ${id} no encontrado`);
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends Error {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} con ${field} "${value}" ya existe`);
    this.name = 'DuplicateError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
