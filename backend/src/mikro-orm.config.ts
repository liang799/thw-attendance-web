import { Options } from '@mikro-orm/core';
import { readFileSync } from 'node:fs';
import 'dotenv/config';

const sslMode = process.env.DB_SSL_MODE || 'DISABLED';

if (!['DISABLED', 'REQUIRED', 'VERIFY_IDENTITY'].includes(sslMode)) {
  throw new Error('DB_SSL_MODE must be DISABLED, REQUIRED, or VERIFY_IDENTITY');
}

const config: Options = {
  entities: ['dist/src/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: 'mysql',
  driverOptions: {
    connection: {
      ssl:
        sslMode === 'DISABLED'
          ? undefined
          : {
              rejectUnauthorized: sslMode === 'VERIFY_IDENTITY',
              verifyIdentity: sslMode === 'VERIFY_IDENTITY',
              ca:
                process.env.DB_SSL_CA ||
                (process.env.DB_SSL_CA_PATH
                  ? readFileSync(process.env.DB_SSL_CA_PATH, 'utf8')
                  : undefined),
            },
    },
  },
  seeder: {
    path: './dist/src/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
};

export default config;
