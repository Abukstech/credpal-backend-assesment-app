import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// TypeORM DataSource for migrations
export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT) || 5432,
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // Use relative path
  migrations: [__dirname + '/../database/*.{ts,js}'], // Migration directory
  synchronize: false, // Disable auto sync for production
  logging: false, // Disable logging for production
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
});