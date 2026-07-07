import { Pool } from 'pg';
import pgvector from 'pgvector/pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'vectordb',
  password: 'postgrespass',
  port: 5432,
});

export async function registerVector() {
  const client = await pool.connect();
  await pgvector.registerType(client);
  client.release();
}
