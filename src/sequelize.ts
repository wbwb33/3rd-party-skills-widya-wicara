import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  database: process.env.DB_NAME,
  models: [__dirname + '/models'],
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT as string),
  logging: false,
});
