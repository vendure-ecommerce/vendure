---
title: "OrderProcess"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderProcess

<GenerationInfo sourceFile="packages/core/src/config/order/order-process.ts" sourceLine="35" packageName="@vendure/core" />

An OrderProcess is used to define the way the order process works as in: what states an Order can be
in, and how it may transition from one state to another. Using the `onTransitionStart()` hook, an
OrderProcess can perform checks before allowing a state transition to occur, and the `onTransitionEnd()`
hook allows logic to be executed after a state change.

For detailed description of the interface members, see the <a href='/reference/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a> docs.

:::info

This is configured via the `orderOptions.process` property of
your VendureConfig.

:::

```ts title="Signature"
interface OrderProcess<State extends keyof CustomOrderStates | string> extends InjectableStrategy {
    transitions?: Transitions<State, State | OrderState> & Partial<Transitions<OrderState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | OrderState, OrderTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | OrderState, OrderTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | OrderState>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### transitions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;State, State | <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>&#62; &#38; Partial&#60;<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;<a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a> | State&#62;&#62;`}   />


### onTransitionStart

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;State | <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, <a href='/reference/typescript-api/orders/order-process#ordertransitiondata'>OrderTransitionData</a>&#62;`}   />


### onTransitionEnd

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;State | <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, <a href='/reference/typescript-api/orders/order-process#ordertransitiondata'>OrderTransitionData</a>&#62;`}   />


### onTransitionError

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;State | <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>&#62;`}   />




</div>


## DefaultOrderProcessOptions

<GenerationInfo sourceFile="packages/core/src/config/order/default-order-process.ts" sourceLine="50" packageName="@vendure/core" since="2.0.0" />

Options which can be passed to the <a href='/reference/typescript-api/orders/order-process#configuredefaultorderprocess'>configureDefaultOrderProcess</a> function
to configure an instance of the default <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a>. By default, all
options are set to `true`.

```ts title="Signature"
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

<div className="members-wrapper">

### checkModificationPayments

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents an Order from transitioning out of the `Modifying` state if
the Order price has changed and there is no Payment or Refund associated
with the Modification.
### checkAdditionalPaymentsAmount

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents an Order from transitioning out of the `ArrangingAdditionalPayment` state if
the Order's Payments do not cover the full amount of `totalWithTax`.
### checkAllVariantsExist

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents the transition from `AddingItems` to any other state (apart from `Cancelled`) if
and of the ProductVariants no longer exists due to deletion.
### arrangingPaymentRequiresContents

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `ArrangingPayment` state if the active Order has no lines.
### arrangingPaymentRequiresCustomer

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `ArrangingPayment` state if the active Order has no customer
associated with it.
### arrangingPaymentRequiresShipping

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `ArrangingPayment` state if the active Order has no shipping
method set.
### arrangingPaymentRequiresStock

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `ArrangingPayment` state if there is insufficient saleable
stock to cover the contents of the Order.
### checkPaymentsCoverTotal

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `PaymentAuthorized` or `PaymentSettled` states if the order
`totalWithTax` amount is not covered by Payment(s) in the corresponding states.
### checkAllItemsBeforeCancel

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `Cancelled` state unless all OrderItems are already
cancelled.
### checkFulfillmentStates

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Prevents transition to the `Shipped`, `PartiallyShipped`, `Delivered` & `PartiallyDelivered` states unless
there are corresponding Fulfillments in the correct states to allow this. E.g. `Shipped` only if all items in
the Order are part of a Fulfillment which itself is in the `Shipped` state.


</div>


## configureDefaultOrderProcess

<GenerationInfo sourceFile="packages/core/src/config/order/default-order-process.ts" sourceLine="163" packageName="@vendure/core" since="2.0.0" />

Used to configure a customized instance of the default <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> that ships with Vendure.
Using this function allows you to turn off certain checks and constraints that are enabled by default.

```ts
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
The <a href='/reference/typescript-api/orders/order-process#defaultorderprocessoptions'>DefaultOrderProcessOptions</a> type defines all available options. If you require even
more customization, you can create your own implementation of the <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> interface.

```ts title="Signature"
function configureDefaultOrderProcess(options: DefaultOrderProcessOptions): void
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/orders/order-process#defaultorderprocessoptions'>DefaultOrderProcessOptions</a>`} />



## defaultOrderProcess

<GenerationInfo sourceFile="packages/core/src/config/order/default-order-process.ts" sourceLine="475" packageName="@vendure/core" since="2.0.0" />

This is the built-in <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> that ships with Vendure. A customized version of this process
can be created using the <a href='/reference/typescript-api/orders/order-process#configuredefaultorderprocess'>configureDefaultOrderProcess</a> function, which allows you to pass in an object
to enable/disable certain checks.



## OrderStates

<GenerationInfo sourceFile="packages/core/src/service/helpers/order-state-machine/order-state.ts" sourceLine="21" packageName="@vendure/core" since="2.0.0" />

An interface to extend the <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a> type.

```ts title="Signature"
interface OrderStates {

}
```


## OrderState

<GenerationInfo sourceFile="packages/core/src/service/helpers/order-state-machine/order-state.ts" sourceLine="42" packageName="@vendure/core" />

These are the default states of the Order process. They can be augmented and
modified by using the <a href='/reference/typescript-api/orders/order-options#orderoptions'>OrderOptions</a> `process` property, and by default
the <a href='/reference/typescript-api/orders/order-process#defaultorderprocess'>defaultOrderProcess</a> will add the states

- `ArrangingPayment`
- `PaymentAuthorized`
- `PaymentSettled`
- `PartiallyShipped`
- `Shipped`
- `PartiallyDelivered`
- `Delivered`
- `Modifying`
- `ArrangingAdditionalPayment`

```ts title="Signature"
type OrderState = | 'Created'
    | 'Draft'
    | 'AddingItems'
    | 'Cancelled'
    | keyof CustomOrderStates
    | keyof OrderStates
```


## OrderTransitionData

<GenerationInfo sourceFile="packages/core/src/service/helpers/order-state-machine/order-state.ts" sourceLine="57" packageName="@vendure/core" />

This is the object passed to the <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> state transition hooks.

```ts title="Signature"
interface OrderTransitionData {
    ctx: RequestContext;
    order: Order;
}
```

<div className="members-wrapper">

### ctx

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />




</div>
