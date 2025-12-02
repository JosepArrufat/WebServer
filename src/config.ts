import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  fileserverHits: number,
  platform: string,
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/lib/db",
};

export const configApi: APIConfig = {
    fileserverHits: 0,
    platform: getRequiredEnv('PLATFORM'),
}

function getRequiredEnv(key: string): string {
  const val = process.env[key];
  if (typeof val === 'undefined' || val === '') {
    throw new Error(`Environment variable ${key} is required`);
  }
  return val;
}

export const config: Config = {
  api: configApi,
  db: {
    dbURL: getRequiredEnv('DB_URL'),
    migrationConfig: migrationConfig,
  },
};


