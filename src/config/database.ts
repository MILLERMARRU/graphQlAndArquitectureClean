import { DataSource } from 'typeorm';
import { config } from './environment';
import { UserModel } from '../infrastructure/database/models/UserModel';
import { PostModel } from '../infrastructure/database/models/PostModel';

/**
 * Configuración de TypeORM para MySQL
 * SOLID: Single Responsibility - Solo configura la conexión a la base de datos
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.database.synchronize, // Solo en desarrollo, en producción usar migraciones
  logging: config.database.logging,
  entities: [UserModel, PostModel],
  subscribers: [],
  migrations: [],
});

/**
 * Inicializa la conexión a la base de datos
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a MySQL establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error);
    throw error;
  }
};

export default AppDataSource;
