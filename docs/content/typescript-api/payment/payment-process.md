---
title: "PaymentProcess"
weight: 10
date: 2023-07-14T16:57:49.666Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentProcess
<div class="symbol">


# PaymentProcess

{{< generation-info sourceFile="packages/core/src/config/payment/payment-process.ts" sourceLine="26" packageName="@vendure/core" since="2.0.0">}}

A PaymentProcess is used to define the way the payment process works as in: what states a Payment can be
in, and how it may transition from one state to another. Using the `onTransitionStart()` hook, a
PaymentProcess can perform checks before allowing a state transition to occur, and the `onTransitionEnd()`
hook allows logic to be executed after a state change.

For detailed description of the interface members, see the <a href='/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a> docs.

## Signature

```TypeScript
interface PaymentProcess<State extends keyof CustomPaymentStates | string> extends InjectableStrategy {
  transitions?: Transitions<State, State | PaymentState> & Partial<Transitions<PaymentState | State>>;
  onTransitionStart?: OnTransitionStartFn<State | PaymentState, PaymentTransitionData>;
  onTransitionEnd?: OnTransitionEndFn<State | PaymentState, PaymentTransitionData>;
  onTransitionError?: OnTransitionErrorFn<State | PaymentState>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### transitions

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;State, State | <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>&#62; &#38; Partial&#60;<a href='/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;<a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> | State&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onTransitionStart

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;State | <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, <a href='/typescript-api/payment/payment-transition-data#paymenttransitiondata'>PaymentTransitionData</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onTransitionEnd

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;State | <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, <a href='/typescript-api/payment/payment-transition-data#paymenttransitiondata'>PaymentTransitionData</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onTransitionError

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;State | <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
