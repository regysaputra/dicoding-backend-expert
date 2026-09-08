import dotenv from 'dotenv';
import { runner } from 'node-pg-migrate';

dotenv.config({ path: '.test.env' });

const conn = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false } // testing only
};

const direction = process.argv[2] || 'up';

await runner({
  databaseUrl: conn,
  dir: 'migrations',
  direction,
  migrationsTable: 'pgmigrations',
  verbose: true
});