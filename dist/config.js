const migrationConfig = {
    migrationsFolder: "./src/lib/db",
};
export const configApi = {
    fileserverHits: 0,
    platform: getRequiredEnv('PLATFORM'),
};
function getRequiredEnv(key) {
    const val = process.env[key];
    if (typeof val === 'undefined' || val === '') {
        throw new Error(`Environment variable ${key} is required`);
    }
    return val;
}
export const config = {
    api: configApi,
    db: {
        dbURL: getRequiredEnv('DB_URL'),
        migrationConfig: migrationConfig,
    },
};
