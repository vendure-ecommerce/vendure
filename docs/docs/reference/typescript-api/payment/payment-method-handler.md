---
title: "PaymentMethodHandler"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentMethodHandler

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="354" packageName="@vendure/core" />

A PaymentMethodHandler contains the code which is used to generate a Payment when a call to the
`addPaymentToOrder` mutation is made. It contains any necessary steps of interfacing with a
third-party payment gateway before the Payment is created and can also define actions to fire
when the state of the payment is changed.

PaymentMethodHandlers are instantiated using a <a href='/reference/typescript-api/payment/payment-method-config-options#paymentmethodconfigoptions'>PaymentMethodConfigOptions</a> object, which
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

```ts title="Signature"
class PaymentMethodHandler<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    constructor(config: PaymentMethodConfigOptions<T>)
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/payment/payment-method-config-options#paymentmethodconfigoptions'>PaymentMethodConfigOptions</a>&#60;T&#62;) => PaymentMethodHandler`}   />




</div>
