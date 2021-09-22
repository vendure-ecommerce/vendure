import Stripe from 'stripe';

import { PaymentMethodArgsHash } from './types';

export function getGateway(args: PaymentMethodArgsHash): Stripe {
    // Reference: https://github.com/stripe/stripe-node
    return new Stripe(args.secretKey.toString(), {
        apiVersion: '2020-08-27',
        appInfo: {
            name: 'VendureIOStripePlugin',
            version: '1.0.0',
            url: 'https://github.com/gaiusmathew/stripe-payment-plugin',
        },
    });
}
