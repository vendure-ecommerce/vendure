import { VendureConfig } from './src/config/vendure-config';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    port: 3000,
    apiPath: 'api',
    cors: true,
    jwtSecret: 'some-secret',
    dbConnectionOptions: {
        type: 'mysql',
        synchronize: true,
        logging: true,
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: 'vendure-dev',
    },
};
