---
title: "PaymentMethodConfigOptions"
weight: 10
date: 2023-07-14T16:57:49.662Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentMethodConfigOptions
<div class="symbol">


# PaymentMethodConfigOptions

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="255" packageName="@vendure/core">}}

Defines the object which is used to construct the <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>.

## Signature

```TypeScript
interface PaymentMethodConfigOptions<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
  createPayment: CreatePaymentFn<T>;
  settlePayment: SettlePaymentFn<T>;
  cancelPayment?: CancelPaymentFn<T>;
  createRefund?: CreateRefundFn<T>;
  onStateTransitionStart?: OnTransitionStartFn<PaymentState, PaymentTransitionData>;
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;


## Members

### createPayment

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-types#createpaymentfn'>CreatePaymentFn</a>&#60;T&#62;"  >}}

{{< member-description >}}This function provides the logic for creating a payment. For example,
it may call out to a third-party service with the data and should return a
<a href='/typescript-api/payment/payment-method-types#createpaymentresult'>CreatePaymentResult</a> object contains the details of the payment.{{< /member-description >}}

### settlePayment

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-types#settlepaymentfn'>SettlePaymentFn</a>&#60;T&#62;"  >}}

{{< member-description >}}This function provides the logic for settling a payment, also known as "capturing".
For payment integrations that settle/capture the payment on creation (i.e. the
`createPayment()` method returns with a state of `'Settled'`) this method
need only return `{ success: true }`.{{< /member-description >}}

### cancelPayment

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-types#cancelpaymentfn'>CancelPaymentFn</a>&#60;T&#62;"  since="1.7.0" >}}

{{< member-description >}}This function provides the logic for cancelling a payment, which would be invoked when a call is
made to the `cancelPayment` mutation in the Admin API. Cancelling a payment can apply
if, for example, you have created a "payment intent" with the payment provider but not yet
completed the payment. It allows the incomplete payment to be cleaned up on the provider's end
if it gets cancelled via Vendure.{{< /member-description >}}

### createRefund

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-types#createrefundfn'>CreateRefundFn</a>&#60;T&#62;"  >}}

{{< member-description >}}This function provides the logic for refunding a payment created with this
payment method. Some payment providers may not provide the facility to
programmatically create a refund. In such a case, this method should be
omitted and any Refunds will have to be settled manually by an administrator.{{< /member-description >}}

### onStateTransitionStart

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;<a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, <a href='/typescript-api/payment/payment-transition-data#paymenttransitiondata'>PaymentTransitionData</a>&#62;"  >}}

{{< member-description >}}This function, when specified, will be invoked before any transition from one <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> to another.
The return value (a sync / async `boolean`) is used to determine whether the transition is permitted.{{< /member-description >}}


</div>
