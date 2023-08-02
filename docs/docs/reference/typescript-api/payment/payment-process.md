---
title: "PaymentProcess"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentProcess

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-process.ts" sourceLine="33" packageName="@vendure/core" since="2.0.0" />

A PaymentProcess is used to define the way the payment process works as in: what states a Payment can be
in, and how it may transition from one state to another. Using the `onTransitionStart()` hook, a
PaymentProcess can perform checks before allowing a state transition to occur, and the `onTransitionEnd()`
hook allows logic to be executed after a state change.

For detailed description of the interface members, see the <a href='/reference/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a> docs.

:::info

This is configured via the `paymentOptions.process` property of
your VendureConfig.

:::

```ts title="Signature"
interface PaymentProcess<State extends keyof CustomPaymentStates | string> extends InjectableStrategy {
    transitions?: Transitions<State, State | PaymentState> & Partial<Transitions<PaymentState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | PaymentState, PaymentTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | PaymentState, PaymentTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | PaymentState>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### transitions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;State, State | <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>&#62; &#38; Partial&#60;<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;<a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> | State&#62;&#62;`}   />


### onTransitionStart

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;State | <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, <a href='/reference/typescript-api/payment/payment-transition-data#paymenttransitiondata'>PaymentTransitionData</a>&#62;`}   />


### onTransitionEnd

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;State | <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, <a href='/reference/typescript-api/payment/payment-transition-data#paymenttransitiondata'>PaymentTransitionData</a>&#62;`}   />


### onTransitionError

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;State | <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>&#62;`}   />




</div>
