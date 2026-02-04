import { CreateUserUseCase } from '../../../application/useCases/user/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../../application/useCases/user/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '../../../application/useCases/user/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../../application/useCases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/useCases/user/DeleteUserUseCase';
import { GetPostsByUserIdUseCase } from '../../../application/useCases/post/GetPostsByUserIdUseCase';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IPostRepository } from '../../../domain/interfaces/IPostRepository';

/**
 * Resolvers de GraphQL para User
 *
 * Los resolvers son funciones que se ejecutan para obtener los datos solicitados.
 * Actúan como el "pegamento" entre GraphQL y la lógica de negocio.
 *
 * Conceptos clave:
 * - Cada campo en el schema puede tener un resolver
 * - Los resolvers reciben: (parent, args, context, info)
 *   - parent: El objeto padre (útil para resolver campos anidados)
 *   - args: Los argumentos pasados en la query
 *   - context: Datos compartidos (repos, auth, etc.)
 *   - info: Metadata sobre la query
 *
 * SOLID Principles:
 * - Dependency Inversion: Dependen de los Use Cases (abstracciones)
 * - Single Responsibility: Cada resolver tiene una única responsabilidad
 */
export const createUserResolvers = (
  userRepository: IUserRepository,
  postRepository: IPostRepository
) => {
  // Instanciar Use Cases
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const getPostsByUserIdUseCase = new GetPostsByUserIdUseCase(postRepository, userRepository);

  return {
    Query: {
      /**
       * Query: Obtener todos los usuarios
       */
      users: async () => {
        return await getAllUsersUseCase.execute();
      },

      /**
       * Query: Obtener un usuario por ID
       */
      user: async (_: any, { id }: { id: string }) => {
        try {
          return await getUserByIdUseCase.execute(id);
        } catch (error) {
          return null;
        }
      },
    },

    Mutation: {
      /**
       * Mutation: Crear un nuevo usuario
       */
      createUser: async (_: any, { input }: { input: any }) => {
        return await createUserUseCase.execute(input);
      },

      /**
       * Mutation: Actualizar un usuario
       */
      updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
        return await updateUserUseCase.execute(id, input);
      },

      /**
       * Mutation: Eliminar un usuario
       */
      deleteUser: async (_: any, { id }: { id: string }) => {
        return await deleteUserUseCase.execute(id);
      },
    },

    User: {
      /**
       * Field Resolver: Obtener los posts del usuario
       * Este es un ejemplo de cómo GraphQL resuelve relaciones
       * Solo se ejecuta si el cliente solicita el campo 'posts'
       */
      posts: async (parent: any) => {
        return await getPostsByUserIdUseCase.execute(parent.id, false);
      },

      /**
       * Field Resolver: Contar posts del usuario
       * Demuestra cómo agregar campos calculados
       */
      postsCount: async (parent: any) => {
        const posts = await getPostsByUserIdUseCase.execute(parent.id, false);
        return posts.length;
      },

      /**
       * Field Resolver: Verificar si es adulto
       * Demuestra cómo exponer métodos de la entidad
       */
      isAdult: (parent: any) => {
        return parent.age >= 18;
      },
    },
  };
};
