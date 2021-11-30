import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';

import { braintreePaymentMethodHandler } from './braintree-payment-method';

export type PaymentMethodArgsHash = ConfigArgValues<typeof braintreePaymentMethodHandler['args']>;
