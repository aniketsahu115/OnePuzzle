import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

const pool = new Pool({
  user: 'postgres',
  password: 'madmax',
  host: 'localhost',
  port: 5432,
  database: 'chess_puzzle'
});

export const db = drizzle(pool, { schema });
