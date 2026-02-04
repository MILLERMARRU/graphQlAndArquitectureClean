import { mergeResolvers } from '@graphql-tools/merge';
import { userTypeDefs } from './schemas/user.schema';
import { postTypeDefs } from './schemas/post.schema';
import { createUserResolvers } from './resolvers/user.resolver';
import { createPostResolvers } from './resolvers/post.resolver';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';

/**
 * Combina todos los schemas y resolvers de GraphQL
 *
 * Este archivo actúa como punto de entrada para toda la configuración de GraphQL.
 * Usa el patrón de composición para combinar múltiples schemas y resolvers.
 */

/**
 * Obtiene todos los type definitions (schemas)
 */
export const getTypeDefs = () => {
  return [userTypeDefs, postTypeDefs];
};

/**
 * Obtiene todos los resolvers
 */
export const getResolvers = (
  userRepository: IUserRepository,
  postRepository: IPostRepository
) => {
  const userResolvers = createUserResolvers(userRepository, postRepository);
  const postResolvers = createPostResolvers(postRepository, userRepository);

  // Merge de resolvers - combina múltiples objetos de resolvers
  // Útil cuando tienes resolvers en múltiples archivos
  return mergeResolvers([userResolvers, postResolvers]);
};
