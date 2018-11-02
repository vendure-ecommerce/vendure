import { Payment, PaymentMetadata } from 'entity/payment/payment.entity';

import { Order } from '../../entity/order/order.entity';

import { PaymentMethodHandler } from './payment-method-handler';

/**
 * An example of a simple client-side payment method, where the payment authorization & settlement is
 * done on the client and no further steps are required on the server.
 */
export const fakePalPaymentHandler = new PaymentMethodHandler({
    code: 'fakepal',
    name: 'FakePal Checkout',
    args: {},
    createPayment: (order: Order, metadata: PaymentMetadata = {}): Payment => {
        return new Payment({
            amount: order.total,
            state: 'Settled',
            transactionId: metadata.transactionId.toString(),
            metadata,
        });
    },
});
