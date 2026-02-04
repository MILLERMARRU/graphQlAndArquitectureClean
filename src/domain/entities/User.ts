/**
 * Entidad de Dominio: User
 *
 * Esta es una entidad de dominio pura, sin dependencias de frameworks.
 * Representa las reglas de negocio y la lógica del dominio para un Usuario.
 *
 * SOLID Principles:
 * - Single Responsibility: Solo define las propiedades y comportamiento de un Usuario
 * - Open/Closed: Abierto a extensión (herencia), cerrado a modificación
 */
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public age: number,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateEmail(email);
    this.validateAge(age);
  }

  /**
   * Valida que el email tenga un formato correcto
   */
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  /**
   * Valida que la edad sea un número positivo
   */
  private validateAge(age: number): void {
    if (age < 0 || age > 150) {
      throw new Error('Edad inválida');
    }
  }

  /**
   * Actualiza la información del usuario
   */
  public update(name?: string, email?: string, age?: number): void {
    if (name) this.name = name;
    if (email) {
      this.validateEmail(email);
      this.email = email;
    }
    if (age !== undefined) {
      this.validateAge(age);
      this.age = age;
    }
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el usuario es mayor de edad
   */
  public isAdult(): boolean {
    return this.age >= 18;
  }
}
