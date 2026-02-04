import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { config } from './config/environment';
import { initializeDatabase } from './config/database';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { PostRepository } from './infrastructure/repositories/PostRepository';
import { getTypeDefs, getResolvers } from './presentation/graphql';
import { webTypeDefs } from './presentation/bff/web/schema';
import { mobileTypeDefs } from './presentation/bff/mobile/schema';
import { createWebResolvers } from './presentation/bff/web/resolvers';
import { createMobileResolvers } from './presentation/bff/mobile/resolvers';

/**
 * Punto de entrada principal de la aplicación
 *
 * Este archivo orquesta todo el sistema:
 * 1. Inicializa la base de datos
 * 2. Crea las instancias de los repositorios
 * 3. Configura los servidores GraphQL (Principal, Web BFF, Mobile BFF)
 * 4. Inicia el servidor Express
 *
 * Arquitectura:
 * - /graphql - API GraphQL principal (completa)
 * - /graphql/web - BFF optimizado para Web
 * - /graphql/mobile - BFF optimizado para Mobile
 */

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicación...\n');

    // 1. Conectar a la base de datos
    await initializeDatabase();

    // 2. Inicializar repositorios (Dependency Injection manual)
    const userRepository = new UserRepository();
    const postRepository = new PostRepository();

    // 3. Configurar Express
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Ruta de health check
    app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        app: config.server.appName,
        timestamp: new Date().toISOString(),
      });
    });

    // 4. Configurar Apollo Server Principal
    const mainServer = new ApolloServer({
      typeDefs: getTypeDefs(),
      resolvers: getResolvers(userRepository, postRepository),
      formatError: (error) => {
        console.error('❌ GraphQL Error:', error);
        return error;
      },
    });

    await mainServer.start();
    app.use(
      '/graphql',
      expressMiddleware(mainServer, {
        context: async ({ req }) => ({
          // Aquí puedes agregar contexto como auth, dataloaders, etc.
        }),
      })
    );
    console.log('✅ GraphQL Principal disponible en /graphql');

    // 5. Configurar BFF para Web
    const webServer = new ApolloServer({
      typeDefs: [webTypeDefs],
      resolvers: createWebResolvers(userRepository, postRepository),
      formatError: (error) => {
        console.error('❌ GraphQL Web Error:', error);
        return error;
      },
    });

    await webServer.start();
    app.use('/graphql/web', expressMiddleware(webServer));
    console.log('✅ GraphQL Web BFF disponible en /graphql/web');

    // 6. Configurar BFF para Mobile
    const mobileServer = new ApolloServer({
      typeDefs: [mobileTypeDefs],
      resolvers: createMobileResolvers(userRepository, postRepository),
      formatError: (error) => {
        console.error('❌ GraphQL Mobile Error:', error);
        return error;
      },
    });

    await mobileServer.start();
    app.use('/graphql/mobile', expressMiddleware(mobileServer));
    console.log('✅ GraphQL Mobile BFF disponible en /graphql/mobile');

    // 7. Documentación de endpoints
    app.get('/', (req, res) => {
      res.json({
        message: '🎉 Bienvenido a GraphQL Clean Architecture',
        endpoints: {
          health: '/health',
          graphql: '/graphql',
          webBFF: '/graphql/web',
          mobileBFF: '/graphql/mobile',
        },
        documentation: {
          graphql: 'Abre /graphql en tu navegador para acceder a Apollo Sandbox',
          web: 'Abre /graphql/web para el BFF Web',
          mobile: 'Abre /graphql/mobile para el BFF Mobile',
        },
      });
    });

    // 8. Iniciar servidor
    const port = config.server.port;
    app.listen(port, () => {
      console.log('\n🎯 Servidor iniciado exitosamente!\n');
      console.log(`📍 URL: http://localhost:${port}`);
      console.log(`🔍 GraphQL Playground: http://localhost:${port}/graphql`);
      console.log(`🌐 Web BFF: http://localhost:${port}/graphql/web`);
      console.log(`📱 Mobile BFF: http://localhost:${port}/graphql/mobile`);
      console.log(`💚 Health Check: http://localhost:${port}/health\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar aplicación
bootstrap();
