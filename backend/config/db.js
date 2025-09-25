import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';

// Load .env reliably from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// dotenv.config({path:"../.env"});

// Ensure all env variables are present
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
  throw new Error('Database configuration incomplete. Check your .env file.');
}

// Create PostgreSQL pool
const pool = new Pool({
  user: String(DB_USER),             // ensure it's a string
  password: String(DB_PASSWORD),     // ensure it's a string
  host: String(DB_HOST),
  port: parseInt(DB_PORT, 10),       // convert to number
  database: String(DB_NAME),
});

// Test connection
pool.connect();

export default pool;
