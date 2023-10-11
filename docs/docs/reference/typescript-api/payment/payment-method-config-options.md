---
title: "PaymentMethodConfigOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentMethodConfigOptions

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="255" packageName="@vendure/core" />

Defines the object which is used to construct the <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>.

```ts title="Signature"
interface PaymentMethodConfigOptions<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    createPayment: CreatePaymentFn<T>;
    settlePayment: SettlePaymentFn<T>;
    cancelPayment?: CancelPaymentFn<T>;
    createRefund?: CreateRefundFn<T>;
    onStateTransitionStart?: OnTransitionStartFn<PaymentState, PaymentTransitionData>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### createPayment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-method-types#createpaymentfn'>CreatePaymentFn</a>&#60;T&#62;`}   />

This function provides the logic for creating a payment. For example,
it may call out to a third-party service with the data and should return a
<a href='/reference/typescript-api/payment/payment-method-types#createpaymentresult'>CreatePaymentResult</a> object contains the details of the payment.
### settlePayment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-method-types#settlepaymentfn'>SettlePaymentFn</a>&#60;T&#62;`}   />

This function provides the logic for settling a payment, also known as "capturing".
For payment integrations that settle/capture the payment on creation (i.e. the
`createPayment()` method returns with a state of `'Settled'`) this method
need only return `{ success: true }`.
### cancelPayment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-method-types#cancelpaymentfn'>CancelPaymentFn</a>&#60;T&#62;`}  since="1.7.0"  />

This function provides the logic for cancelling a payment, which would be invoked when a call is
made to the `cancelPayment` mutation in the Admin API. Cancelling a payment can apply
if, for example, you have created a "payment intent" with the payment provider but not yet
completed the payment. It allows the incomplete payment to be cleaned up on the provider's end
if it gets cancelled via Vendure.
### createRefund

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-method-types#createrefundfn'>CreateRefundFn</a>&#60;T&#62;`}   />

This function provides the logic for refunding a payment created with this
payment method. Some payment providers may not provide the facility to
programmatically create a refund. In such a case, this method should be
omitted and any Refunds will have to be settled manually by an administrator.
### onStateTransitionStart

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;<a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, <a href='/reference/typescript-api/payment/payment-transition-data#paymenttransitiondata'>PaymentTransitionData</a>&#62;`}   />

This function, when specified, will be invoked before any transition from one <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> to another.
The return value (a sync / async `boolean`) is used to determine whether the transition is permitted.


</div>
