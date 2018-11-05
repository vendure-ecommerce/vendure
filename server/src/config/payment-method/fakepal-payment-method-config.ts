import { Order } from '../../entity/order/order.entity';
import { PaymentMetadata } from '../../entity/payment/payment.entity';

import { PaymentConfig, PaymentMethodHandler } from './payment-method-handler';

/**
 * An example of a simple client-side payment method, where the payment authorization & settlement is
 * done on the client and no further steps are required on the server.
 */
export const fakePalPaymentHandler = new PaymentMethodHandler({
    code: 'fakepal',
    name: 'FakePal Checkout',
    args: {},
    createPayment: (order: Order, metadata: PaymentMetadata = {}): PaymentConfig => {
        return {
            amount: order.total,
            state: 'Settled',
            transactionId: metadata.transactionId.toString(),
            metadata,
        };
    },
});
