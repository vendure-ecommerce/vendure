export type DbType = 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'sqljs' | 'mssql' | 'oracle';

export interface FileSources {
    indexSource: string;
    indexWorkerSource: string;
    configSource: string;
    envSource: string;
    envDtsSource: string;
    readmeSource: string;
    dockerfileSource: string;
    dockerComposeSource: string;
}

export interface UserResponses extends FileSources {
    dbType: DbType;
    populateProducts: boolean;
    superadminIdentifier: string;
    superadminPassword: string;
}

export type PackageManager = 'npm' | 'yarn';

export type CliLogLevel = 'silent' | 'info' | 'verbose';
