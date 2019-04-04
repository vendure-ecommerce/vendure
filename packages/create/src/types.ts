export type DbType = 'mysql' | 'postgres' | 'sqlite' | 'sqljs' | 'mssql' | 'oracle';

export interface UserResponses {
    usingTs: boolean;
    dbType: DbType;
    populateProducts: boolean;
    indexSource: string;
    configSource: string;
}

export type LogLevel = 'silent' | 'info' | 'verbose';
