import { Sequelize } from 'sequelize';
import env from './env';
import { logger } from '../utils/logger';

const sequelize = new Sequelize({
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false,
    } : false,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL database connection established successfully');

    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('Database models synchronized');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

export default sequelize;
