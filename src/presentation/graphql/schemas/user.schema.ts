import gql from 'graphql-tag';

/**
 * Schema de GraphQL para User
 *
 * Define los tipos, queries y mutations para la entidad User.
 * GraphQL proporciona un sistema de tipos fuerte y auto-documentado.
 *
 * Conceptos clave de GraphQL:
 * - Type: Define la estructura de datos
 * - Query: Operaciones de lectura (GET)
 * - Mutation: Operaciones de escritura (POST, PUT, DELETE)
 * - Input: Tipo especial para argumentos de entrada
 */
export const userTypeDefs = gql`
  """
  Representa un usuario en el sistema
  """
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    createdAt: String!
    updatedAt: String!
    """
    Posts creados por este usuario (relación)
    """
    posts: [Post!]!
    """
    Número total de posts del usuario
    """
    postsCount: Int!
    """
    Indica si el usuario es mayor de edad
    """
    isAdult: Boolean!
  }

  """
  Input para crear un nuevo usuario
  """
  input CreateUserInput {
    name: String!
    email: String!
    age: Int!
  }

  """
  Input para actualizar un usuario existente
  """
  input UpdateUserInput {
    name: String
    email: String
    age: Int
  }

  """
  Queries relacionadas con usuarios
  """
  type Query {
    """
    Obtiene todos los usuarios
    """
    users: [User!]!

    """
    Obtiene un usuario por su ID
    """
    user(id: ID!): User
  }

  """
  Mutations relacionadas con usuarios
  """
  type Mutation {
    """
    Crea un nuevo usuario
    """
    createUser(input: CreateUserInput!): User!

    """
    Actualiza un usuario existente
    """
    updateUser(id: ID!, input: UpdateUserInput!): User!

    """
    Elimina un usuario
    """
    deleteUser(id: ID!): Boolean!
  }
`;
