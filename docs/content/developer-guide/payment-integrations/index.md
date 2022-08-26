---
title: 'Payment Integrations'
showtoc: true
---

# Payment Integrations

Vendure can support many kinds of payment workflows, such as authorizing and capturing payment in a single step upon checkout or authorizing on checkout and then capturing on fulfillment.

{{< alert "primary" >}}
For complete working examples of real payment integrations, see the [payments-plugins](https://github.com/vendure-ecommerce/vendure/tree/master/packages/payments-plugin/src)
{{< /alert >}}

## Authorization & Settlement

Typically, there are 2 parts to an online payment: **authorization** and **settlement**:

-   **Authorization** is the process by which the customer's bank is contacted to check whether the transaction is allowed. At this stage, no funds are removed from the customer's account.
-   **Settlement** (also known as "capture") is the process by which the funds are transferred from the customer's account to the merchant.

Some merchants do both of these steps at once, when the customer checks out of the store. Others do the authorize step at checkout, and only do the settlement at some later point, e.g. upon shipping the goods to the customer.

This two-step workflow can also be applied to other non-card forms of payment: e.g. if providing a "payment on delivery" option, the authorization step would occur on checkout, and the settlement step would be triggered upon delivery, either manually by an administrator of via an app integration with the Admin API.

## Creating an integration

Payment integrations are created by defining a new [PaymentMethodHandler]({{< relref "payment-method-handler" >}}) and passing that handler into the [`paymentOptions.paymentMethodHandlers`]({{< relref "payment-options" >}}) array in the VendureConfig.

```TypeScript
import { PaymentMethodHandler, VendureConfig, CreatePaymentResult, SettlePaymentResult, SettlePaymentErrorResult } from '@vendure/core';
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
  createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
    try {
      const result = await sdk.charges.create({
        amount,
        apiKey: args.apiKey,
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
  settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
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

### Creating a PaymentMethod

Once the PaymentMethodHandler is defined as above, you can use it to create a new PaymentMethod via the Admin UI (_Settings_ -> _Payment methods_, then _Create new payment method_) or via the Admin API `createPaymentMethod` mutation.

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

## Custom Payment Flows

If you need to support an entirely different payment flow than the above, it is also possible to do so by configuring a [CustomPaymentProcess]({{< relref "custom-payment-process" >}}). This allows new Payment states and transitions to be defined, as well as allowing custom logic to run on Payment state transitions.

Here's an example which adds a new "Validating" state to the Payment state machine, and combines it with a [CustomOrderProcess]({{< relref "custom-order-process" >}}), [PaymentMethodHandler]({{< relref "payment-method-handler" >}}) and [OrderPlacedStrategy]({{< relref "order-placed-strategy" >}}).

```TypeScript
// types.ts
import { CustomOrderStates } from '@vendure/core';

/**
 * Declare your custom state in special interface to make it type-safe
 */
declare module '@vendure/core' {
  interface CustomPaymentStates {
    Validating: never;
  }
}

/**
 * Define a new "Validating" Payment state, and set up the
 * permitted transitions to/from it.
 */
const customPaymentProcess: CustomPaymentProcess<'Validating'> = {
  transitions: {
    Created: {
      to: ['Validating'],
      mergeStrategy: 'replace',
    },
    Validating: {
      to: ['Settled', 'Declined', 'Cancelled'],
    },
  },
};

/**
 * Define a new "ValidatingPayment" Order state, and set up the
 * permitted transitions to/from it.
 */
const customOrderProcess: CustomOrderProcess<'ValidatingPayment'> = {
  transitions: {
    ArrangingPayment: {
      to: ['ValidatingPayment'],
      mergeStrategy: 'replace',
    },
    ValidatingPayment: {
      to: ['PaymentAuthorized', 'PaymentSettled', 'ArrangingAdditionalPayment'],
    },
  },
};

/**
 * This PaymentMethodHandler creates the Payment in the custom "Validating"
 * state.
 */
const myPaymentHandler = new PaymentMethodHandler({
  code: 'my-payment-handler',
  description: [{ languageCode: LanguageCode.en, value: 'My payment handler' }],
  args: {},
  createPayment: (ctx, order, amount, args, metadata) => {
    // payment provider logic omitted
    return {
      state: 'Validating' as any,
      amount,
      metadata,
    };
  },
  settlePayment: (ctx, order, payment) => {
    return {
      success: true,
    };
  },
});

/**
 * This OrderPlacedStrategy tells Vendure to set the Order as "placed"
 * when it transitions to the custom "ValidatingPayment" state.
 */
class MyOrderPlacedStrategy implements OrderPlacedStrategy {
  shouldSetAsPlaced(ctx: RequestContext, fromState: OrderState, toState: OrderState): boolean | Promise<boolean> {
    return fromState === 'ArrangingPayment' && toState === ('ValidatingPayment' as any);
  }
}

// Combine the above in the VendureConfig
export const config: VendureConfig = {
  // ...
  orderOptions: {
    process: [customOrderProcess],
    orderPlacedStrategy: new MyOrderPlacedStrategy(),
  },
  paymentOptions: {
    customPaymentProcess: [customPaymentProcess],
    paymentMethodHandlers: [myPaymentHandler],
  },
};
```

### Integration with hosted payment pages

A hosted payment page is a system that works similar to (Stripe checkout)[https://stripe.com/payments/checkout]. The idea behind this flow is that the customer does not enter any credit card data anywhere on the merchant's site which waives the merchant from the responsibility to take care of sensitive data.

The checkout flow works as follows:

1. The user makes a POST to the card processor's URL via a Vendure served page
2. The card processor accepts card information from the user and authorizes a payment
3. The card processor redirects the user back to Vendure via a POST which contains details about the processed payment
4. There is a pre-shared secret between the merchant and processor used to sign cross-site POST requests

When integrating with a system like this, you would need to create a Controller to accept POST redirects from the payment processor (usually a success and a failure URL), as well as serve a POST form on your store frontend.

With a hosted payment form the payment is already authorized by the time the card processor makes the POST request to Vendure, possibly settled even, so the payment handler won't do anything in particular - just return the data it has been passed. The validation of the POST request is done in the controller or service and the payment amount and payment reference are just passed to the payment handler which passes them on.
