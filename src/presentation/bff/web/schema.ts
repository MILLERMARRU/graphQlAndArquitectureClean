import gql from 'graphql-tag';

/**
 * BFF (Backend For Frontend) - Schema para Web
 *
 * El patrón BFF consiste en crear APIs específicas para cada tipo de cliente.
 * Esto permite optimizar las respuestas según las necesidades del cliente.
 *
 * Ventajas del patrón BFF:
 * 1. Optimización específica por plataforma
 * 2. Reduce over-fetching y under-fetching
 * 3. Simplifica el código del cliente
 * 4. Permite evolucionar APIs de forma independiente
 *
 * Este BFF para Web puede incluir:
 * - Más datos en las respuestas (mejor ancho de banda)
 * - Campos adicionales útiles solo para web
 * - Queries más complejas
 */
export const webTypeDefs = gql`
  """
  Usuario con datos extendidos para Web
  """
  type UserWeb {
    id: ID!
    name: String!
    email: String!
    age: Int!
    isAdult: Boolean!
    createdAt: String!
    updatedAt: String!
    posts: [PostWeb!]!
    postsCount: Int!
    """
    Estadísticas adicionales para dashboard web
    """
    publishedPostsCount: Int!
    draftPostsCount: Int!
  }

  """
  Post con datos extendidos para Web
  """
  type PostWeb {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
    author: UserWeb!
    """
    Preview del contenido (primeros 200 caracteres)
    """
    contentPreview: String!
    """
    Longitud del contenido
    """
    contentLength: Int!
  }

  type Query {
    """
    Dashboard: Obtiene todos los usuarios con estadísticas
    """
    webUsers: [UserWeb!]!

    """
    Obtiene un usuario con todos sus detalles
    """
    webUser(id: ID!): UserWeb

    """
    Feed de posts para la página principal
    """
    webPostsFeed(limit: Int, publishedOnly: Boolean): [PostWeb!]!

    """
    Obtiene un post con detalles completos
    """
    webPost(id: ID!): PostWeb
  }
`;
