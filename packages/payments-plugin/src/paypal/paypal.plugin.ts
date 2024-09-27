import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { adminSchemaExtensions, shopSchemaExtensions } from './api-extensions';
import { PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { paypalPaymentMethodHandler } from './paypal.handler';
import { PayPalService } from './paypal.service';
import { PayPalShopResolver } from './paypal.shop-resolver';
import { PayPalPluginOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        { provide: PAYPAL_PAYMENT_PLUGIN_OPTIONS, useFactory: () => PayPalPlugin.options },
        PayPalService,
    ],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(paypalPaymentMethodHandler);

        return config;
    },
    compatibility: '^3.0.0',
    adminApiExtensions: {
        schema: shopSchemaExtensions,
    },
    shopApiExtensions: {
        resolvers: [PayPalShopResolver],
        schema: adminSchemaExtensions,
    },
})
export class PayPalPlugin {
    static options: PayPalPluginOptions;

    static init(options: PayPalPluginOptions): Type<PayPalPlugin> {
        this.options = options;
        return PayPalPlugin;
    }
}
