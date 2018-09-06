import { API_PATH, API_PORT } from 'shared/shared-constants';

import { VendureConfig } from './src/config/vendure-config';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    disableAuth: true,
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
        Facet: [{ name: 'searchable', type: 'boolean' }],
        FacetValue: [{ name: 'link', type: 'string' }, { name: 'available', type: 'boolean' }],
        Product: [
            { name: 'infoUrl', type: 'string' },
            { name: 'downloadable', type: 'boolean' },
            { name: 'nickname', type: 'localeString' },
        ],
    },
};
