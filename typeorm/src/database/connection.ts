import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { dbConfig, nodeEnv } from "@/config/env";

// Create a singleton DataSource instance
let dataSource: DataSource | null = null;

export const getDataSource = async (): Promise<DataSource> => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: dbConfig.synchronize, // Auto-create database schema (not recommended for production)
    logging: nodeEnv !== "production",
    entities: [User],
  });

  return await dataSource.initialize();
};
