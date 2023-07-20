---
title: "PaymentMethodHandler"
weight: 10
date: 2023-07-14T16:57:49.665Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentMethodHandler
<div class="symbol">


# PaymentMethodHandler

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="354" packageName="@vendure/core">}}

A PaymentMethodHandler contains the code which is used to generate a Payment when a call to the
`addPaymentToOrder` mutation is made. It contains any necessary steps of interfacing with a
third-party payment gateway before the Payment is created and can also define actions to fire
when the state of the payment is changed.

PaymentMethodHandlers are instantiated using a <a href='/typescript-api/payment/payment-method-config-options#paymentmethodconfigoptions'>PaymentMethodConfigOptions</a> object, which
configures the business logic used to create, settle and refund payments.

*Example*

```ts
import { PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult, LanguageCode } from '@vendure/core';
// A mock 3rd-party payment SDK
import gripeSDK from 'gripe';

export const examplePaymentHandler = new PaymentMethodHandler({
  code: 'example-payment-provider',
  description: [{
    languageCode: LanguageCode.en,
    value: 'Example Payment Provider',
  }],
  args: {
    apiKey: { type: 'string' },
  },
  createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
    try {
      const result = await gripeSDK.charges.create({
        amount,
        apiKey: args.apiKey,
        source: metadata.authToken,
      });
      return {
        amount: order.total,
        state: 'Settled' as const,
        transactionId: result.id.toString(),
        metadata: result.outcome,
      };
    } catch (err: any) {
      return {
        amount: order.total,
        state: 'Declined' as const,
        metadata: {
          errorMessage: err.message,
        },
      };
    }
  },
  settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
    return { success: true };
  }
});
```

## Signature

```TypeScript
class PaymentMethodHandler<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
  constructor(config: PaymentMethodConfigOptions<T>)
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;


## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/payment/payment-method-config-options#paymentmethodconfigoptions'>PaymentMethodConfigOptions</a>&#60;T&#62;) => PaymentMethodHandler"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
