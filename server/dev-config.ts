import { API_PATH, API_PORT } from '../shared/shared-constants';

import { VendureConfig } from './src/config/vendure-config';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    port: API_PORT,
    apiPath: API_PATH,
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
    customFields: {
        Product: [
            { name: 'infoUrl', type: 'string' },
            { name: 'downloadable', type: 'boolean' },
            { name: 'nickname', type: 'localeString' },
        ],
    },
};
