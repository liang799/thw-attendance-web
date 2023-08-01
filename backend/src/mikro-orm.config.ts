import { Options } from "@mikro-orm/core";
import 'dotenv/config';

const config: Options = {
  entities: ["dist/src/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: "mysql"
};

export default config;
