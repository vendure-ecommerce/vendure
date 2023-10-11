---
title: "Payment Method Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CreatePaymentResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="30" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#createpaymentfn'>CreatePaymentFn</a>.

```ts title="Signature"
interface CreatePaymentResult {
    amount: number;
    state: Exclude<PaymentState, 'Error'>;
    transactionId?: string;
    errorMessage?: string;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### amount

<MemberInfo kind="property" type={`number`}   />

The amount (as an integer - i.e. $10 = `1000`) that this payment is for.
Typically this should equal the Order total, unless multiple payment methods
are being used for the order.
### state

<MemberInfo kind="property" type={`Exclude&#60;<a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, 'Error'&#62;`}   />

The <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> of the resulting Payment.

In a single-step payment flow, this should be set to `'Settled'`.
In a two-step flow, this should be set to `'Authorized'`.

If using a {@link CustomPaymentProcess}, may be something else
entirely according to your business logic.
### transactionId

<MemberInfo kind="property" type={`string`}   />

The unique payment reference code typically assigned by
the payment provider.
### errorMessage

<MemberInfo kind="property" type={`string`}   />

If the payment is declined or fails for ome other reason, pass the
relevant error message here, and it gets returned with the
ErrorResponse of the `addPaymentToOrder` mutation.
### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />

This field can be used to store other relevant data which is often
provided by the payment provider, such as security data related to
the payment method or data used in troubleshooting or debugging.

Any data stored in the optional `public` property will be available
via the Shop API. This is useful for certain checkout flows such as
external gateways, where the payment provider returns a unique
url which must then be passed to the storefront app.


</div>


## CreatePaymentErrorResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="83" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#createpaymentfn'>CreatePaymentFn</a> when there has been an error.

```ts title="Signature"
interface CreatePaymentErrorResult {
    amount: number;
    state: 'Error';
    transactionId?: string;
    errorMessage: string;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### amount

<MemberInfo kind="property" type={`number`}   />


### state

<MemberInfo kind="property" type={`'Error'`}   />


### transactionId

<MemberInfo kind="property" type={`string`}   />


### errorMessage

<MemberInfo kind="property" type={`string`}   />


### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>


## CreateRefundResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="98" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#createrefundfn'>CreateRefundFn</a>.

```ts title="Signature"
interface CreateRefundResult {
    state: RefundState;
    transactionId?: string;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>`}   />


### transactionId

<MemberInfo kind="property" type={`string`}   />


### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>


## SettlePaymentResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="112" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#settlepaymentfn'>SettlePaymentFn</a> when the Payment
has been successfully settled.

```ts title="Signature"
interface SettlePaymentResult {
    success: true;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### success

<MemberInfo kind="property" type={`true`}   />


### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>


## SettlePaymentErrorResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="125" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#settlepaymentfn'>SettlePaymentFn</a> when the Payment
could not be settled.

```ts title="Signature"
interface SettlePaymentErrorResult {
    success: false;
    state?: Exclude<PaymentState, 'Settled'>;
    errorMessage?: string;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### success

<MemberInfo kind="property" type={`false`}   />


### state

<MemberInfo kind="property" type={`Exclude&#60;<a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, 'Settled'&#62;`}   />

The state to transition this Payment to upon unsuccessful settlement.
Defaults to `Error`. Note that if using a different state, it must be
legal to transition to that state from the `Authorized` state according
to the PaymentState config (which can be customized using the
{@link CustomPaymentProcess}).
### errorMessage

<MemberInfo kind="property" type={`string`}   />

The message that will be returned when attempting to settle the payment, and will
also be persisted as `Payment.errorMessage`.
### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>


## CancelPaymentResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="153" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#cancelpaymentfn'>CancelPaymentFn</a> when the Payment
has been successfully cancelled.

```ts title="Signature"
interface CancelPaymentResult {
    success: true;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### success

<MemberInfo kind="property" type={`true`}   />


### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>


## CancelPaymentErrorResult

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="165" packageName="@vendure/core" />

This object is the return value of the <a href='/reference/typescript-api/payment/payment-method-types#cancelpaymentfn'>CancelPaymentFn</a> when the Payment
could not be cancelled.

```ts title="Signature"
interface CancelPaymentErrorResult {
    success: false;
    state?: Exclude<PaymentState, 'Cancelled'>;
    errorMessage?: string;
    metadata?: PaymentMetadata;
}
```

<div className="members-wrapper">

### success

<MemberInfo kind="property" type={`false`}   />


### state

<MemberInfo kind="property" type={`Exclude&#60;<a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, 'Cancelled'&#62;`}   />

The state to transition this Payment to upon unsuccessful cancellation.
Defaults to `Error`. Note that if using a different state, it must be
legal to transition to that state from the `Authorized` state according
to the PaymentState config (which can be customized using the
{@link CustomPaymentProcess}).
### errorMessage

<MemberInfo kind="property" type={`string`}   />

The message that will be returned when attempting to cancel the payment, and will
also be persisted as `Payment.errorMessage`.
### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>


## CreatePaymentFn

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="193" packageName="@vendure/core" />

This function contains the logic for creating a payment. See <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

Returns a <a href='/reference/typescript-api/payment/payment-method-types#createpaymentresult'>CreatePaymentResult</a>.

```ts title="Signature"
type CreatePaymentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    amount: number,
    args: ConfigArgValues<T>,
    metadata: PaymentMetadata,
    method: PaymentMethod,
) => CreatePaymentResult | CreatePaymentErrorResult | Promise<CreatePaymentResult | CreatePaymentErrorResult>
```


## SettlePaymentFn

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="209" packageName="@vendure/core" />

This function contains the logic for settling a payment. See <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

```ts title="Signature"
type SettlePaymentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => SettlePaymentResult | SettlePaymentErrorResult | Promise<SettlePaymentResult | SettlePaymentErrorResult>
```


## CancelPaymentFn

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="224" packageName="@vendure/core" />

This function contains the logic for cancelling a payment. See <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

```ts title="Signature"
type CancelPaymentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => CancelPaymentResult | CancelPaymentErrorResult | Promise<CancelPaymentResult | CancelPaymentErrorResult>
```


## CreateRefundFn

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="239" packageName="@vendure/core" />

This function contains the logic for creating a refund. See <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

```ts title="Signature"
type CreateRefundFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    input: RefundOrderInput,
    amount: number,
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => CreateRefundResult | Promise<CreateRefundResult>
```
