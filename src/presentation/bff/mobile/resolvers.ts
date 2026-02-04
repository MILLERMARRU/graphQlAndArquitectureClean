import { GetAllUsersUseCase } from '../../../application/useCases/user/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '../../../application/useCases/user/GetUserByIdUseCase';
import { GetAllPostsUseCase } from '../../../application/useCases/post/GetAllPostsUseCase';
import { GetPostByIdUseCase } from '../../../application/useCases/post/GetPostByIdUseCase';
import { GetPostsByUserIdUseCase } from '../../../application/useCases/post/GetPostsByUserIdUseCase';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';

/**
 * Resolvers específicos para el BFF Mobile
 *
 * Estos resolvers proporcionan datos optimizados para clientes móviles
 * con respuestas más ligeras y eficientes
 */
export const createMobileResolvers = (
  userRepository: IUserRepository,
  postRepository: IPostRepository
) => {
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const getAllPostsUseCase = new GetAllPostsUseCase(postRepository);
  const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
  const getPostsByUserIdUseCase = new GetPostsByUserIdUseCase(postRepository, userRepository);

  return {
    Query: {
      mobileUsers: async (_: any, { limit }: { limit?: number }) => {
        const users = await getAllUsersUseCase.execute();
        return limit ? users.slice(0, limit) : users.slice(0, 20); // Límite por defecto de 20
      },

      mobileUser: async (_: any, { id }: { id: string }) => {
        try {
          return await getUserByIdUseCase.execute(id);
        } catch (error) {
          return null;
        }
      },

      mobilePostsFeed: async (
        _: any,
        { limit, offset }: { limit: number; offset?: number }
      ) => {
        const posts = await getAllPostsUseCase.execute(true); // Solo publicados
        const start = offset || 0;
        return posts.slice(start, start + Math.min(limit, 50)); // Máximo 50
      },

      mobilePost: async (_: any, { id }: { id: string }) => {
        try {
          return await getPostByIdUseCase.execute(id);
        } catch (error) {
          return null;
        }
      },

      mobileUserPosts: async (_: any, { userId, limit }: { userId: string; limit: number }) => {
        const posts = await getPostsByUserIdUseCase.execute(userId, true);
        return posts.slice(0, Math.min(limit, 50)); // Máximo 50
      },
    },

    UserMobile: {
      postsCount: async (parent: any) => {
        const posts = await getPostsByUserIdUseCase.execute(parent.id, false);
        return posts.length;
      },
    },

    PostMobile: {
      contentPreview: (parent: any) => {
        // Truncar a 100 caracteres para listas en mobile
        return parent.content.substring(0, 100) + (parent.content.length > 100 ? '...' : '');
      },

      authorName: async (parent: any) => {
        const author = await getUserByIdUseCase.execute(parent.userId);
        return author.name;
      },

      authorId: (parent: any) => {
        return parent.userId;
      },
    },

    PostMobileDetail: {
      author: async (parent: any) => {
        return await getUserByIdUseCase.execute(parent.userId);
      },
    },
  };
};
