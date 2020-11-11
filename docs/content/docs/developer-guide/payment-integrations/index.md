---
title: "Payment Integrations"
showtoc: true
---

# Payment Integrations

Vendure can support many kinds of payment workflows, such as authorizing and capturing payment in a single step upon checkout or authorizing on checkout and then capturing on fulfillment. 

{{< alert "primary" >}}
  For a complete working example of a real payment integration, see the [real-world-vendure Braintree plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/braintree)
{{< /alert >}}

## Authorization & Settlement

Typically, there are 2 parts to an online payment: **authorization** and **settlement**:

* **Authorization** is the process by which the customer's bank is contacted to check whether the transaction is allowed. At this stage, no funds are removed from the customer's account.
* **Settlement** (also known as "capture") is the process by which the funds are transferred from the customer's account to the merchant.

Some merchants do both of these steps at once, when the customer checks out of the store. Others do the authorize step at checkout, and only do the settlement at some later point, e.g. upon shipping the goods to the customer.

This two-step workflow can also be applied to other non-card forms of payment: e.g. if providing a "payment on delivery" option, the authorization step would occur on checkout, and the settlement step would be triggered upon delivery, either manually by an administrator of via an app integration with the Admin API.

## Creating an integration

Payment integrations are created by defining a new [PaymentMethodHandler]({{< relref "payment-method-handler" >}}) and passing that handler into the [`paymentOptions.paymentMethodHandlers`]({{< relref "payment-options" >}}) array in the VendureConfig.

```TypeScript
import { PaymentMethodHandler, VendureConfig, CreatePaymentResult, SettlePaymentResult } from '@vendure/core';
import { sdk } from 'payment-provider-sdk';

/**
 * This is a handler which integrates Vendure with an imaginary
 * payment provider, who provide a Node SDK which we use to 
 * interact with their APIs.
 */
const myPaymentIntegration = new PaymentMethodHandler({
  code: 'my-payment-method',
  description: [{
    languageCode: LanguageCode.en,
    value: 'My Payment Provider',
  }],
  args: {
    apiKey: { type: 'string' },
  },

  /** This is called when the `addPaymentToOrder` mutation is executed */
  createPayment: async (ctx, order, args, metadata): Promise<CreatePaymentResult> => {
    try {
      const result = await sdk.charges.create({
        apiKey: args.apiKey,
        amount: order.total,
        source: metadata.token,
      });
      return {
        amount: order.total,
        state: 'Authorized' as const,
        transactionId: result.id.toString(),
        metadata: {
          cardInfo: result.cardInfo,
          // Any metadata in the `public` field
          // will be available in the Shop API,
          // All other metadata is private and 
          // only available in the Admin API.
          public: {
            referenceCode: result.publicId,
          }
        },
      };
    } catch (err) {
      return {
        amount: order.total,
        state: 'Declined' as const,
        metadata: {
          errorMessage: err.message,
        },
      };
    }
  },

  /** This is called when the `settlePayment` mutation is executed */
  settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
    try {
      const result = await sdk.charges.capture({ 
        apiKey: args.apiKey,
        id: payment.transactionId,
      });
      return { success: true };   
    } catch (err) {
      return {
        success: false,
        errorMessage: err.message,
      }
    }
  },
});

/**
 * We now add this handler to our config
 */
export const config: VendureConfig = {
  // ...
  paymentOptions: {
    paymentMethodHandlers: [myPaymentIntegration],
  },
};
```

{{% alert %}}
**Dependency Injection**

If your PaymentMethodHandler needs access to the database or other providers, see the [ConfigurableOperationDef Dependency Injection guide]({{< relref "configurable-operation-def" >}}#dependency-injection).
{{< /alert >}}

## Payment flow

1. Once the active Order has been transitioned to the ArrangingPayment state (see the [Order Workflow guide]({{< relref "order-workflow" >}})), one or more Payments are created by executing the [`addPaymentToOrder` mutation]({{< relref "/docs/graphql-api/shop/mutations#addpaymenttoorder" >}}). This mutation has a required `method` input field, which _must_ match the `code` of one of the configured PaymentMethodHandlers. In the case above, this would be set to `"my-payment-method"`.
    ```GraphQL
    mutation {
        addPaymentToOrder(input: { 
            method: "my-payment-method",
            metadata: { token: "<some token from the payment provider>" }) {
            ...Order
        }
    }
    ```
   The `metadata` field is used to store the specific data required by the payment provider. E.g. some providers have a client-side part which begins the transaction and returns a token which must then be verified on the server side.
2. This mutation internally invokes the [PaymentMethodHandler's `createPayment()` function]({{< relref "payment-method-config-options" >}}#createpayment). This function returns a [CreatePaymentResult object]({{< relref "payment-method-types" >}}#payment-method-types) which is used to create a new [Payment]({{< relref "/docs/typescript-api/entities/payment" >}}). If the Payment amount equals the order total, then the Order is transitioned to either the "PaymentAuthorized" or "PaymentSettled" state and the customer checkout flow is complete.

### Single-step

If the `createPayment()` function returns a result with the state set to `'Settled'`, then this is a single-step ("authorize & capture") flow, as illustrated below:

{{< figure src="./payment_sequence_one_step.png" >}}

### Two-step

If the `createPayment()` function returns a result with the state set to `'Authorized'`, then this is a two-step flow, and the settlement / capture part is performed at some later point, e.g. when shipping the goods, or on confirmation of payment-on-delivery.

{{< figure src="./payment_sequence_two_step.png" >}}

