/**
 * This script demonstrates the environment variable validation functionality.
 * It can be run with different environment variables to see how the validation works.
 * 
 * Example usage:
 * 1. Run with all required variables:
 *    DB_HOST=localhost DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=postgres DB_DATABASE=typeorm ts-node src/config/validate-env.ts
 * 
 * 2. Run with missing variables to see validation errors:
 *    DB_HOST=localhost ts-node src/config/validate-env.ts
 */

import { dbConfig } from './env';

console.log('Environment variables validated successfully!');
console.log('Database configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  // Not logging password for security reasons
  database: dbConfig.database,
  synchronize: dbConfig.synchronize
});

console.log('\nNote: If any required environment variables were missing, this script would have thrown an error before reaching this point.');