---
title: "Payment Method Types"
weight: 10
date: 2023-07-14T16:57:49.650Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Payment Method Types
<div class="symbol">


# CreatePaymentResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="30" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#createpaymentfn'>CreatePaymentFn</a>.

## Signature

```TypeScript
interface CreatePaymentResult {
  amount: number;
  state: Exclude<PaymentState, 'Error'>;
  transactionId?: string;
  errorMessage?: string;
  metadata?: PaymentMetadata;
}
```
## Members

### amount

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The amount (as an integer - i.e. $10 = `1000`) that this payment is for.
Typically this should equal the Order total, unless multiple payment methods
are being used for the order.{{< /member-description >}}

### state

{{< member-info kind="property" type="Exclude&#60;<a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, 'Error'&#62;"  >}}

{{< member-description >}}The <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> of the resulting Payment.

In a single-step payment flow, this should be set to `'Settled'`.
In a two-step flow, this should be set to `'Authorized'`.

If using a {@link CustomPaymentProcess}, may be something else
entirely according to your business logic.{{< /member-description >}}

### transactionId

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The unique payment reference code typically assigned by
the payment provider.{{< /member-description >}}

### errorMessage

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}If the payment is declined or fails for ome other reason, pass the
relevant error message here, and it gets returned with the
ErrorResponse of the `addPaymentToOrder` mutation.{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}This field can be used to store other relevant data which is often
provided by the payment provider, such as security data related to
the payment method or data used in troubleshooting or debugging.

Any data stored in the optional `public` property will be available
via the Shop API. This is useful for certain checkout flows such as
external gateways, where the payment provider returns a unique
url which must then be passed to the storefront app.{{< /member-description >}}


</div>
<div class="symbol">


# CreatePaymentErrorResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="83" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#createpaymentfn'>CreatePaymentFn</a> when there has been an error.

## Signature

```TypeScript
interface CreatePaymentErrorResult {
  amount: number;
  state: 'Error';
  transactionId?: string;
  errorMessage: string;
  metadata?: PaymentMetadata;
}
```
## Members

### amount

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="'Error'"  >}}

{{< member-description >}}{{< /member-description >}}

### transactionId

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### errorMessage

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CreateRefundResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="98" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#createrefundfn'>CreateRefundFn</a>.

## Signature

```TypeScript
interface CreateRefundResult {
  state: RefundState;
  transactionId?: string;
  metadata?: PaymentMetadata;
}
```
## Members

### state

{{< member-info kind="property" type="<a href='/typescript-api/payment/refund-state#refundstate'>RefundState</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### transactionId

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SettlePaymentResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="112" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#settlepaymentfn'>SettlePaymentFn</a> when the Payment
has been successfully settled.

## Signature

```TypeScript
interface SettlePaymentResult {
  success: true;
  metadata?: PaymentMetadata;
}
```
## Members

### success

{{< member-info kind="property" type="true"  >}}

{{< member-description >}}{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SettlePaymentErrorResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="125" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#settlepaymentfn'>SettlePaymentFn</a> when the Payment
could not be settled.

## Signature

```TypeScript
interface SettlePaymentErrorResult {
  success: false;
  state?: Exclude<PaymentState, 'Settled'>;
  errorMessage?: string;
  metadata?: PaymentMetadata;
}
```
## Members

### success

{{< member-info kind="property" type="false"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="Exclude&#60;<a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, 'Settled'&#62;"  >}}

{{< member-description >}}The state to transition this Payment to upon unsuccessful settlement.
Defaults to `Error`. Note that if using a different state, it must be
legal to transition to that state from the `Authorized` state according
to the PaymentState config (which can be customized using the
{@link CustomPaymentProcess}).{{< /member-description >}}

### errorMessage

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The message that will be returned when attempting to settle the payment, and will
also be persisted as `Payment.errorMessage`.{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CancelPaymentResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="153" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#cancelpaymentfn'>CancelPaymentFn</a> when the Payment
has been successfully cancelled.

## Signature

```TypeScript
interface CancelPaymentResult {
  success: true;
  metadata?: PaymentMetadata;
}
```
## Members

### success

{{< member-info kind="property" type="true"  >}}

{{< member-description >}}{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CancelPaymentErrorResult

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="165" packageName="@vendure/core">}}

This object is the return value of the <a href='/typescript-api/payment/payment-method-types#cancelpaymentfn'>CancelPaymentFn</a> when the Payment
could not be cancelled.

## Signature

```TypeScript
interface CancelPaymentErrorResult {
  success: false;
  state?: Exclude<PaymentState, 'Cancelled'>;
  errorMessage?: string;
  metadata?: PaymentMetadata;
}
```
## Members

### success

{{< member-info kind="property" type="false"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="Exclude&#60;<a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, 'Cancelled'&#62;"  >}}

{{< member-description >}}The state to transition this Payment to upon unsuccessful cancellation.
Defaults to `Error`. Note that if using a different state, it must be
legal to transition to that state from the `Authorized` state according
to the PaymentState config (which can be customized using the
{@link CustomPaymentProcess}).{{< /member-description >}}

### errorMessage

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The message that will be returned when attempting to cancel the payment, and will
also be persisted as `Payment.errorMessage`.{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CreatePaymentFn

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="193" packageName="@vendure/core">}}

This function contains the logic for creating a payment. See <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

Returns a <a href='/typescript-api/payment/payment-method-types#createpaymentresult'>CreatePaymentResult</a>.

## Signature

```TypeScript
type CreatePaymentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    amount: number,
    args: ConfigArgValues<T>,
    metadata: PaymentMetadata,
    method: PaymentMethod,
) => CreatePaymentResult | CreatePaymentErrorResult | Promise<CreatePaymentResult | CreatePaymentErrorResult>
```
</div>
<div class="symbol">


# SettlePaymentFn

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="209" packageName="@vendure/core">}}

This function contains the logic for settling a payment. See <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

## Signature

```TypeScript
type SettlePaymentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => SettlePaymentResult | SettlePaymentErrorResult | Promise<SettlePaymentResult | SettlePaymentErrorResult>
```
</div>
<div class="symbol">


# CancelPaymentFn

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="224" packageName="@vendure/core">}}

This function contains the logic for cancelling a payment. See <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

## Signature

```TypeScript
type CancelPaymentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => CancelPaymentResult | CancelPaymentErrorResult | Promise<CancelPaymentResult | CancelPaymentErrorResult>
```
</div>
<div class="symbol">


# CreateRefundFn

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-handler.ts" sourceLine="239" packageName="@vendure/core">}}

This function contains the logic for creating a refund. See <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a> for an example.

## Signature

```TypeScript
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
</div>
