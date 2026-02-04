/**
 * Entidad de Dominio: Post
 *
 * Esta es una entidad de dominio pura, sin dependencias de frameworks.
 * Representa las reglas de negocio y la lógica del dominio para una Publicación.
 *
 * SOLID Principles:
 * - Single Responsibility: Solo define las propiedades y comportamiento de un Post
 * - Open/Closed: Abierto a extensión, cerrado a modificación
 */
export class Post {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public userId: string, // Relación con User
    public published: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateTitle(title);
    this.validateContent(content);
  }

  /**
   * Valida que el título no esté vacío y tenga longitud mínima
   */
  private validateTitle(title: string): void {
    if (!title || title.trim().length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }
    if (title.length > 200) {
      throw new Error('El título no puede exceder 200 caracteres');
    }
  }

  /**
   * Valida que el contenido no esté vacío
   */
  private validateContent(content: string): void {
    if (!content || content.trim().length < 10) {
      throw new Error('El contenido debe tener al menos 10 caracteres');
    }
  }

  /**
   * Actualiza la información del post
   */
  public update(title?: string, content?: string): void {
    if (title) {
      this.validateTitle(title);
      this.title = title;
    }
    if (content) {
      this.validateContent(content);
      this.content = content;
    }
    this.updatedAt = new Date();
  }

  /**
   * Publica el post
   */
  public publish(): void {
    this.published = true;
    this.updatedAt = new Date();
  }

  /**
   * Despublica el post
   */
  public unpublish(): void {
    this.published = false;
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el post está publicado
   */
  public isPublished(): boolean {
    return this.published;
  }
}
