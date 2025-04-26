import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Required for Neon database connection in serverless environments
neonConfig.webSocketConstructor = ws;

// For local development if no DATABASE_URL is set
const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/testdb';

// Create a connection pool even if it doesn't actually connect
// This allows the application to run without a real database
export const pool = new Pool({ 
  connectionString,
  // Add connection timeout to avoid hanging when no database is available
  connect_timeout: 3,
});

// Create a Drizzle instance with the pool
export const db = drizzle(pool, { schema });