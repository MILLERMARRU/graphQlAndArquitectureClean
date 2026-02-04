import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración centralizada de variables de entorno
 * SOLID: Single Responsibility - Solo maneja la configuración
 */
export const config = {
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'GraphQL Clean Architecture',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3303', 10),
    name: process.env.DB_NAME || 'graphql_db',
    user: process.env.DB_USER || 'graphql_user',
    password: process.env.DB_PASSWORD || 'graphql_pass',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
};

export default config;
