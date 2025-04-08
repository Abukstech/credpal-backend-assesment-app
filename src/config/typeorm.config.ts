import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const isProductionEnvironment = process.env.NODE_ENV === 'production';


export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',

  host: isProductionEnvironment ? process.env.MYSQL_HOST : process.env.MYSQL_HOST_LOCAL,
  username: isProductionEnvironment ? process.env.MYSQL_USER :  process.env.MYSQL_USER_LOCAL,
  database: isProductionEnvironment ? process.env.MYSQL_DATABASE :  process.env.MYSQL_DATABASE_LOCAL,
  password: isProductionEnvironment ? process.env.MYSQL_PASSWORD :  process.env.MYSQL_PASSWORD_LOCAL,
  port: Number(process.env.MYSQL_PORT) || 3306, // Default MySQL port is 3306
  // host: process.env.PG_HOST,
  // username: process.env.PG_USER,
  // database: process.env.PG_DATABASE,
  // password: process.env.PG_PASSWORD,
  
  // url: process.env.MYSQL_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.entity.{.ts,.js}'], // Migration files directory
  // migrationsRun: true,
  // migrationsTableName: 'migrations_TypeORM',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  synchronize: false, // Auto-create database tables based on entities (not recommended for production)
  // autoLoadEntities: true, // Automatically load entity files
  logging: false, // Disable logging SQL queries
  // ssl: {
  //   rejectUnauthorized: false, // Reject unauthorized SSL connections
  // },
};