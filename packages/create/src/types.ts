export type DbType = 'mysql' | 'postgres' | 'sqlite' | 'sqljs' | 'mssql' | 'oracle';

export interface UserResponses {
    usingTs: boolean;
    dbType: DbType;
    populateProducts: boolean;
    indexSource: string;
    indexWorkerSource: string;
    configSource: string;
}

export type CliLogLevel = 'silent' | 'info' | 'verbose';
