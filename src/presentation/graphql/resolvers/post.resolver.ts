import { CreatePostUseCase } from '../../../application/useCases/post/CreatePostUseCase';
import { GetAllPostsUseCase } from '../../../application/useCases/post/GetAllPostsUseCase';
import { GetPostByIdUseCase } from '../../../application/useCases/post/GetPostByIdUseCase';
import { GetPostsByUserIdUseCase } from '../../../application/useCases/post/GetPostsByUserIdUseCase';
import { UpdatePostUseCase } from '../../../application/useCases/post/UpdatePostUseCase';
import { DeletePostUseCase } from '../../../application/useCases/post/DeletePostUseCase';
import { GetUserByIdUseCase } from '../../../application/useCases/user/GetUserByIdUseCase';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

/**
 * Resolvers de GraphQL para Post
 *
 * Demuestra cómo manejar relaciones entre entidades en GraphQL.
 *
 * SOLID Principles:
 * - Dependency Inversion: Dependen de los Use Cases
 * - Single Responsibility: Cada resolver tiene una única responsabilidad
 */
export const createPostResolvers = (
  postRepository: IPostRepository,
  userRepository: IUserRepository
) => {
  // Instanciar Use Cases
  const createPostUseCase = new CreatePostUseCase(postRepository, userRepository);
  const getAllPostsUseCase = new GetAllPostsUseCase(postRepository);
  const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
  const getPostsByUserIdUseCase = new GetPostsByUserIdUseCase(postRepository, userRepository);
  const updatePostUseCase = new UpdatePostUseCase(postRepository);
  const deletePostUseCase = new DeletePostUseCase(postRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

  return {
    Query: {
      /**
       * Query: Obtener todos los posts
       */
      posts: async (_: any, { publishedOnly }: { publishedOnly?: boolean }) => {
        return await getAllPostsUseCase.execute(publishedOnly || false);
      },

      /**
       * Query: Obtener un post por ID
       */
      post: async (_: any, { id }: { id: string }) => {
        try {
          return await getPostByIdUseCase.execute(id);
        } catch (error) {
          return null;
        }
      },

      /**
       * Query: Obtener posts de un usuario
       */
      postsByUser: async (
        _: any,
        { userId, publishedOnly }: { userId: string; publishedOnly?: boolean }
      ) => {
        return await getPostsByUserIdUseCase.execute(userId, publishedOnly || false);
      },
    },

    Mutation: {
      /**
       * Mutation: Crear un nuevo post
       */
      createPost: async (_: any, { input }: { input: any }) => {
        return await createPostUseCase.execute(input);
      },

      /**
       * Mutation: Actualizar un post
       */
      updatePost: async (_: any, { id, input }: { id: string; input: any }) => {
        return await updatePostUseCase.execute(id, input);
      },

      /**
       * Mutation: Eliminar un post
       */
      deletePost: async (_: any, { id }: { id: string }) => {
        return await deletePostUseCase.execute(id);
      },

      /**
       * Mutation: Publicar un post
       */
      publishPost: async (_: any, { id }: { id: string }) => {
        return await updatePostUseCase.execute(id, { published: true });
      },

      /**
       * Mutation: Despublicar un post
       */
      unpublishPost: async (_: any, { id }: { id: string }) => {
        return await updatePostUseCase.execute(id, { published: false });
      },
    },

    Post: {
      /**
       * Field Resolver: Obtener el autor del post
       * Este es un ejemplo de N+1 query problem en GraphQL
       * En producción, deberías usar DataLoader para optimizar esto
       */
      author: async (parent: any) => {
        return await getUserByIdUseCase.execute(parent.userId);
      },
    },
  };
};
