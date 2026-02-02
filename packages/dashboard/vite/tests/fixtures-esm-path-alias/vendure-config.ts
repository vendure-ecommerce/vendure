import { MyPlugin } from '@esm-plugins/my-plugin';
import { VendureConfig } from '@vendure/core';

const somePath = import.meta.url;

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
    },
    authOptions: {
        tokenMethod: 'bearer',
    },
    dbConnectionOptions: {
        type: 'postgres',
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    plugins: [MyPlugin],
};
