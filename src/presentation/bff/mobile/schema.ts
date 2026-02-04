import gql from 'graphql-tag';

/**
 * BFF (Backend For Frontend) - Schema para Mobile
 *
 * Este BFF está optimizado para clientes móviles, considerando:
 * - Menor ancho de banda
 * - Respuestas más ligeras
 * - Datos esenciales solamente
 * - Paginación obligatoria para listas grandes
 *
 * Las diferencias con el BFF Web incluyen:
 * - Campos reducidos
 * - Sin campos calculados costosos
 * - Límites de tamaño en queries
 */
export const mobileTypeDefs = gql`
  """
  Usuario con datos básicos para Mobile
  """
  type UserMobile {
    id: ID!
    name: String!
    email: String!
    age: Int!
    """
    Solo el conteo, no los posts completos (ahorra bandwidth)
    """
    postsCount: Int!
  }

  """
  Post con datos básicos para Mobile
  """
  type PostMobile {
    id: ID!
    title: String!
    """
    Contenido truncado para listas (máximo 100 caracteres)
    """
    contentPreview: String!
    published: Boolean!
    createdAt: String!
    """
    Solo datos básicos del autor
    """
    authorName: String!
    authorId: ID!
  }

  """
  Post con detalles completos para vista individual
  """
  type PostMobileDetail {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    author: UserMobile!
  }

  type Query {
    """
    Lista simple de usuarios para mobile
    """
    mobileUsers(limit: Int): [UserMobile!]!

    """
    Obtiene un usuario específico
    """
    mobileUser(id: ID!): UserMobile

    """
    Feed optimizado para mobile con límite obligatorio
    """
    mobilePostsFeed(limit: Int!, offset: Int): [PostMobile!]!

    """
    Detalles completos de un post
    """
    mobilePost(id: ID!): PostMobileDetail

    """
    Posts de un usuario específico
    """
    mobileUserPosts(userId: ID!, limit: Int!): [PostMobile!]!
  }
`;
