import { OnApplicationBootstrap } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';
import { json } from 'body-parser';
import cloneBuffer from 'clone-buffer';
import * as http from 'http';

import { RawBodyIncomingMessage } from './interfaces';
import { stripePaymentMethodHandler } from './stripe-payment-methods';

/**
 * This plugin implements the Stripe (https://www.stripe.com/) payment provider.
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [],

    configuration: (config: RuntimeVendureConfig) => {
        config.paymentOptions.paymentMethodHandlers.push(stripePaymentMethodHandler);
        return config;
    },
})
export class StripePlugin implements OnApplicationBootstrap {
    static beforeVendureBootstrap(app: INestApplication): void | Promise<void> {
        // https://yanndanthu.github.io/2019/07/04/Checking-Stripe-Webhook-Signatures-from-NestJS.html
        app.use(
            json({
                verify(req: RawBodyIncomingMessage, res: http.ServerResponse, buf: Buffer) {
                    if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
                        req.rawBody = cloneBuffer(buf);
                    }
                    return true;
                },
            }),
        );
    }

    async onApplicationBootstrap(): Promise<void> {
        // nothing to see here.
    }
}
