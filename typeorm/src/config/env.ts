// Environment variable configuration module
// This module validates and exports environment variables

// Define the structure of our environment variables
interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

// Function to validate that a required environment variable exists
function validateEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

// Function to get an optional environment variable with a default value
function getEnvWithDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

// Export validated database configuration
export const dbConfig: DatabaseConfig = {
  host: validateEnv('DB_HOST'),
  port: parseInt(validateEnv('DB_PORT')),
  username: validateEnv('DB_USERNAME'),
  password: validateEnv('DB_PASSWORD'),
  database: validateEnv('DB_DATABASE'),
  synchronize: getEnvWithDefault('DB_SYNCHRONIZE', 'false') === 'true',
};

// Export other environment variables as needed
export const nodeEnv = getEnvWithDefault('NODE_ENV', 'development');