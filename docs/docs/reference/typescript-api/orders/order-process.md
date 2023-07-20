---
title: "OrderProcess"
weight: 10
date: 2023-07-14T16:57:49.591Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderProcess
<div class="symbol">


# OrderProcess

{{< generation-info sourceFile="packages/core/src/config/order/order-process.ts" sourceLine="28" packageName="@vendure/core">}}

An OrderProcess is used to define the way the order process works as in: what states an Order can be
in, and how it may transition from one state to another. Using the `onTransitionStart()` hook, an
OrderProcess can perform checks before allowing a state transition to occur, and the `onTransitionEnd()`
hook allows logic to be executed after a state change.

For detailed description of the interface members, see the <a href='/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a> docs.

## Signature

```TypeScript
interface OrderProcess<State extends keyof CustomOrderStates | string> extends InjectableStrategy {
  transitions?: Transitions<State, State | OrderState> & Partial<Transitions<OrderState | State>>;
  onTransitionStart?: OnTransitionStartFn<State | OrderState, OrderTransitionData>;
  onTransitionEnd?: OnTransitionEndFn<State | OrderState, OrderTransitionData>;
  onTransitionError?: OnTransitionErrorFn<State | OrderState>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### transitions

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;State, State | <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>&#62; &#38; Partial&#60;<a href='/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;<a href='/typescript-api/orders/order-process#orderstate'>OrderState</a> | State&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onTransitionStart

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;State | <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, <a href='/typescript-api/orders/order-process#ordertransitiondata'>OrderTransitionData</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onTransitionEnd

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;State | <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, <a href='/typescript-api/orders/order-process#ordertransitiondata'>OrderTransitionData</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onTransitionError

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;State | <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# DefaultOrderProcessOptions

{{< generation-info sourceFile="packages/core/src/config/order/default-order-process.ts" sourceLine="50" packageName="@vendure/core" since="2.0.0">}}

Options which can be passed to the <a href='/typescript-api/orders/order-process#configuredefaultorderprocess'>configureDefaultOrderProcess</a> function
to configure an instance of the default <a href='/typescript-api/orders/order-process#orderprocess'>OrderProcess</a>. By default, all
options are set to `true`.

## Signature

```TypeScript
interface DefaultOrderProcessOptions {
  checkModificationPayments?: boolean;
  checkAdditionalPaymentsAmount?: boolean;
  checkAllVariantsExist?: boolean;
  arrangingPaymentRequiresContents?: boolean;
  arrangingPaymentRequiresCustomer?: boolean;
  arrangingPaymentRequiresShipping?: boolean;
  arrangingPaymentRequiresStock?: boolean;
  checkPaymentsCoverTotal?: boolean;
  checkAllItemsBeforeCancel?: boolean;
  checkFulfillmentStates?: boolean;
}
```
## Members

### checkModificationPayments

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents an Order from transitioning out of the `Modifying` state if
the Order price has changed and there is no Payment or Refund associated
with the Modification.{{< /member-description >}}

### checkAdditionalPaymentsAmount

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents an Order from transitioning out of the `ArrangingAdditionalPayment` state if
the Order's Payments do not cover the full amount of `totalWithTax`.{{< /member-description >}}

### checkAllVariantsExist

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents the transition from `AddingItems` to any other state (apart from `Cancelled`) if
and of the ProductVariants no longer exists due to deletion.{{< /member-description >}}

### arrangingPaymentRequiresContents

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `ArrangingPayment` state if the active Order has no lines.{{< /member-description >}}

### arrangingPaymentRequiresCustomer

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `ArrangingPayment` state if the active Order has no customer
associated with it.{{< /member-description >}}

### arrangingPaymentRequiresShipping

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `ArrangingPayment` state if the active Order has no shipping
method set.{{< /member-description >}}

### arrangingPaymentRequiresStock

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `ArrangingPayment` state if there is insufficient saleable
stock to cover the contents of the Order.{{< /member-description >}}

### checkPaymentsCoverTotal

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `PaymentAuthorized` or `PaymentSettled` states if the order
`totalWithTax` amount is not covered by Payment(s) in the corresponding states.{{< /member-description >}}

### checkAllItemsBeforeCancel

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `Cancelled` state unless all OrderItems are already
cancelled.{{< /member-description >}}

### checkFulfillmentStates

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Prevents transition to the `Shipped`, `PartiallyShipped`, `Delivered` & `PartiallyDelivered` states unless
there are corresponding Fulfillments in the correct states to allow this. E.g. `Shipped` only if all items in
the Order are part of a Fulfillment which itself is in the `Shipped` state.{{< /member-description >}}


</div>
<div class="symbol">


# configureDefaultOrderProcess

{{< generation-info sourceFile="packages/core/src/config/order/default-order-process.ts" sourceLine="163" packageName="@vendure/core" since="2.0.0">}}

Used to configure a customized instance of the default <a href='/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> that ships with Vendure.
Using this function allows you to turn off certain checks and constraints that are enabled by default.

```TypeScript
import { configureDefaultOrderProcess, VendureConfig } from '@vendure/core';

const myCustomOrderProcess = configureDefaultOrderProcess({
  // Disable the constraint that requires
  // Orders to have a shipping method assigned
  // before payment.
  arrangingPaymentRequiresShipping: false,
});

export const config: VendureConfig = {
  orderOptions: {
    process: [myCustomOrderProcess],
  },
};
```
The <a href='/typescript-api/orders/order-process#defaultorderprocessoptions'>DefaultOrderProcessOptions</a> type defines all available options. If you require even
more customization, you can create your own implementation of the <a href='/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> interface.

## Signature

```TypeScript
function configureDefaultOrderProcess(options: DefaultOrderProcessOptions): void
```
## Parameters

### options

{{< member-info kind="parameter" type="<a href='/typescript-api/orders/order-process#defaultorderprocessoptions'>DefaultOrderProcessOptions</a>" >}}

</div>
<div class="symbol">


# defaultOrderProcess

{{< generation-info sourceFile="packages/core/src/config/order/default-order-process.ts" sourceLine="474" packageName="@vendure/core" since="2.0.0">}}

This is the built-in <a href='/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> that ships with Vendure. A customized version of this process
can be created using the <a href='/typescript-api/orders/order-process#configuredefaultorderprocess'>configureDefaultOrderProcess</a> function, which allows you to pass in an object
to enable/disable certain checks.

</div>
<div class="symbol">


# OrderStates

{{< generation-info sourceFile="packages/core/src/service/helpers/order-state-machine/order-state.ts" sourceLine="21" packageName="@vendure/core" since="2.0.0">}}

An interface to extend the <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a> type.

## Signature

```TypeScript
interface OrderStates {

}
```
</div>
<div class="symbol">


# OrderState

{{< generation-info sourceFile="packages/core/src/service/helpers/order-state-machine/order-state.ts" sourceLine="42" packageName="@vendure/core">}}

These are the default states of the Order process. They can be augmented and
modified by using the <a href='/typescript-api/orders/order-options#orderoptions'>OrderOptions</a> `process` property, and by default
the <a href='/typescript-api/orders/order-process#defaultorderprocess'>defaultOrderProcess</a> will add the states

- `ArrangingPayment`
- `PaymentAuthorized`
- `PaymentSettled`
- `PartiallyShipped`
- `Shipped`
- `PartiallyDelivered`
- `Delivered`
- `Modifying`
- `ArrangingAdditionalPayment`

## Signature

```TypeScript
type OrderState = | 'Created'
    | 'Draft'
    | 'AddingItems'
    | 'Cancelled'
    | keyof CustomOrderStates
    | keyof OrderStates
```
</div>
<div class="symbol">


# OrderTransitionData

{{< generation-info sourceFile="packages/core/src/service/helpers/order-state-machine/order-state.ts" sourceLine="57" packageName="@vendure/core">}}

This is the object passed to the <a href='/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> state transition hooks.

## Signature

```TypeScript
interface OrderTransitionData {
  ctx: RequestContext;
  order: Order;
}
```
## Members

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
