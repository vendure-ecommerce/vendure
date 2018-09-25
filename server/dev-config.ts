import * as path from 'path';
import { API_PATH, API_PORT } from 'shared/shared-constants';

import { VendureConfig } from './src/config/vendure-config';
import { DefaultAssetServerPlugin } from './src/plugin/default-asset-server/default-asset-server-plugin';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    authOptions: {
        disableAuth: false,
        sessionSecret: 'some-secret',
    },
    port: API_PORT,
    apiPath: API_PATH,
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
    plugins: [
        new DefaultAssetServerPlugin({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            port: 4000,
            hostname: 'http://localhost',
            previewMaxHeight: 1600,
            previewMaxWidth: 1600,
            presets: [
                { name: 'tiny', width: 50, height: 50, mode: 'crop' },
                { name: 'thumb', width: 150, height: 150, mode: 'crop' },
                { name: 'small', width: 300, height: 300, mode: 'resize' },
                { name: 'medium', width: 500, height: 500, mode: 'resize' },
                { name: 'large', width: 800, height: 800, mode: 'resize' },
            ],
        }),
    ],
};
