import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';

import { MollieController } from './mollie.controller';
import { molliePaymentHandler } from './mollie.handler';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [MollieController],
    configuration: (config: RuntimeVendureConfig) => {
        config.paymentOptions.paymentMethodHandlers.push(molliePaymentHandler);
        return config;
    },
})
export class MolliePlugin {
    static context = 'MolliePlugin';
    static host: string;

    /**
     * Initialize the mollie payment plugin
     * @param vendureHost is needed to pass to mollie for callback
     */
    static init(vendureHost: string): typeof MolliePlugin {
            this.host =  vendureHost.endsWith('/') ? vendureHost.slice(0, -1) : vendureHost; // remove appending slash
        return MolliePlugin;
    }
}
