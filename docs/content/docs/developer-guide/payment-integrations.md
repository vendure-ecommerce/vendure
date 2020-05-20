---
title: "Payment Integrations"
showtoc: true
---

# Payment Integrations

Vendure can support many kinds of payment workflows, such as authorizing and capturing payment in a single step upon checkout or authorizing on checkout and then capturing on fulfillment. 

{{< alert "primary" >}}
  For a complete working example of a real payment integration, see the [real-world-vendure Braintree plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/braintree)
{{< /alert >}}

## Creating an integration

Payment integrations are created by creating a new [PaymentMethodHandler]({{< relref "payment-method-handler" >}}) and passing that handler into the [`paymentOptions.paymentMethodHandlers`]({{< relref "payment-options" >}}) array in the VendureConfig.

```TypeScript
import { PaymentMethodHandler, VendureConfig } from '@vendure/core';

const myPaymentIntegration = new PaymentMethodHandler({
    code: 'my-payment-method',
    // ... 
    // configuration of the handler (see PaymentMethodConfigOptions docs)
});

export const config: VendureConfig = {
    // ...
    paymentOptions: {
        paymentMethodHandlers: [myPaymentIntegration],
    },
};
```

For a more complete example of a payment integration, see the [PaymentMethodHandler]({{< relref "payment-method-handler" >}}) documentation.

## Using an integration

In your storefront application, this payment method can then be used when executing the [`addPaymentToOrder` mutation]({{< relref "/docs/graphql-api/shop/mutations#addpaymenttoorder" >}}), as the "method" field of the [`PaymentInput` object]({{< relref "/docs/graphql-api/shop/input-types#paymentinput" >}}).

```SDL
mutation {
    addPaymentToOrder(input: { 
        method: "my-payment-method",
        metadata: { id: "<some id from the payment provider>" }) {
        ...Order
    }
}
```
