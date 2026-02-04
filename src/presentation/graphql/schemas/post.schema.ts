import gql from 'graphql-tag';

/**
 * Schema de GraphQL para Post
 *
 * Define los tipos, queries y mutations para la entidad Post.
 * Demuestra cómo se manejan las relaciones en GraphQL.
 */
export const postTypeDefs = gql`
  """
  Representa una publicación en el sistema
  """
  type Post {
    id: ID!
    title: String!
    content: String!
    userId: ID!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
    """
    Usuario autor del post (relación)
    Este es un ejemplo de cómo GraphQL resuelve relaciones
    """
    author: User!
  }

  """
  Input para crear un nuevo post
  """
  input CreatePostInput {
    title: String!
    content: String!
    userId: ID!
    published: Boolean
  }

  """
  Input para actualizar un post existente
  """
  input UpdatePostInput {
    title: String
    content: String
    published: Boolean
  }

  """
  Queries relacionadas con posts
  """
  type Query {
    """
    Obtiene todos los posts
    """
    posts(publishedOnly: Boolean): [Post!]!

    """
    Obtiene un post por su ID
    """
    post(id: ID!): Post

    """
    Obtiene los posts de un usuario específico
    """
    postsByUser(userId: ID!, publishedOnly: Boolean): [Post!]!
  }

  """
  Mutations relacionadas con posts
  """
  type Mutation {
    """
    Crea un nuevo post
    """
    createPost(input: CreatePostInput!): Post!

    """
    Actualiza un post existente
    """
    updatePost(id: ID!, input: UpdatePostInput!): Post!

    """
    Elimina un post
    """
    deletePost(id: ID!): Boolean!

    """
    Publica un post
    """
    publishPost(id: ID!): Post!

    """
    Despublica un post
    """
    unpublishPost(id: ID!): Post!
  }
`;
