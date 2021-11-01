import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';
import { MollieController } from './mollie.controller';
import { molliePaymentHandler } from './mollie.handler';
import { PLUGIN_INIT_OPTIONS } from './constants';

export interface MolliePluginOptions {
    vendureHost: string;
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [MollieController],
    providers: [{ provide: PLUGIN_INIT_OPTIONS, useFactory: () => MolliePlugin.options }],
    configuration: (config: RuntimeVendureConfig) => {
        config.paymentOptions.paymentMethodHandlers.push(molliePaymentHandler);
        return config;
    },
})
export class MolliePlugin {
    static options: MolliePluginOptions;

    /**
     * Initialize the mollie payment plugin
     * @param vendureHost is needed to pass to mollie for callback
     */
    static init(options: MolliePluginOptions): typeof MolliePlugin {
        this.options = options;
        return MolliePlugin;
    }
}
