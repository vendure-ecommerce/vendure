import { VendureConfig } from '@vendure/core';
import * as path from 'path';

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
    },
    dbConnectionOptions: {
        type: 'sqlite',
        database: path.join(__dirname, '../test.db'),
        synchronize: false,
        logging: false,
        migrations: [path.join(__dirname, '../migrations/*.ts')],
    },
    authOptions: {
        tokenMethod: 'bearer',
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    plugins: [],
};
