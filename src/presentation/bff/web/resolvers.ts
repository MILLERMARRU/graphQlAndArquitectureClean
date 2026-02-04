import { GetAllUsersUseCase } from '../../../application/useCases/user/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '../../../application/useCases/user/GetUserByIdUseCase';
import { GetAllPostsUseCase } from '../../../application/useCases/post/GetAllPostsUseCase';
import { GetPostByIdUseCase } from '../../../application/useCases/post/GetPostByIdUseCase';
import { GetPostsByUserIdUseCase } from '../../../application/useCases/post/GetPostsByUserIdUseCase';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';

/**
 * Resolvers específicos para el BFF Web
 *
 * Estos resolvers proporcionan datos optimizados para clientes web
 */
export const createWebResolvers = (
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
      webUsers: async () => {
        return await getAllUsersUseCase.execute();
      },

      webUser: async (_: any, { id }: { id: string }) => {
        try {
          return await getUserByIdUseCase.execute(id);
        } catch (error) {
          return null;
        }
      },

      webPostsFeed: async (
        _: any,
        { limit, publishedOnly }: { limit?: number; publishedOnly?: boolean }
      ) => {
        const posts = await getAllPostsUseCase.execute(publishedOnly || false);
        return limit ? posts.slice(0, limit) : posts;
      },

      webPost: async (_: any, { id }: { id: string }) => {
        try {
          return await getPostByIdUseCase.execute(id);
        } catch (error) {
          return null;
        }
      },
    },

    UserWeb: {
      posts: async (parent: any) => {
        return await getPostsByUserIdUseCase.execute(parent.id, false);
      },

      postsCount: async (parent: any) => {
        const posts = await getPostsByUserIdUseCase.execute(parent.id, false);
        return posts.length;
      },

      publishedPostsCount: async (parent: any) => {
        const posts = await getPostsByUserIdUseCase.execute(parent.id, true);
        return posts.length;
      },

      draftPostsCount: async (parent: any) => {
        const allPosts = await getPostsByUserIdUseCase.execute(parent.id, false);
        return allPosts.filter((post) => !post.published).length;
      },

      isAdult: (parent: any) => {
        return parent.age >= 18;
      },
    },

    PostWeb: {
      author: async (parent: any) => {
        return await getUserByIdUseCase.execute(parent.userId);
      },

      contentPreview: (parent: any) => {
        return parent.content.substring(0, 200) + (parent.content.length > 200 ? '...' : '');
      },

      contentLength: (parent: any) => {
        return parent.content.length;
      },
    },
  };
};
