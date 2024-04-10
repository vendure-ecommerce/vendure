---
title: "FulfillmentProcess"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## defaultFulfillmentProcess

<GenerationInfo sourceFile="packages/core/src/config/fulfillment/default-fulfillment-process.ts" sourceLine="45" packageName="@vendure/core" since="2.0.0" />

The default <a href='/reference/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a>. This process includes the following actions:

- Executes the configured `FulfillmentHandler.onFulfillmentTransition()` before any state
  transition.
- On cancellation of a Fulfillment, creates the necessary <a href='/reference/typescript-api/entities/stock-movement#cancellation'>Cancellation</a> & <a href='/reference/typescript-api/entities/stock-movement#allocation'>Allocation</a>
  stock movement records.
- When a Fulfillment transitions from the `Created` to `Pending` state, the necessary
  <a href='/reference/typescript-api/entities/stock-movement#sale'>Sale</a> stock movements are created.



## FulfillmentProcess

<GenerationInfo sourceFile="packages/core/src/config/fulfillment/fulfillment-process.ts" sourceLine="26" packageName="@vendure/core" since="2.0.0" />

A FulfillmentProcess is used to define the way the fulfillment process works as in: what states a Fulfillment can be
in, and how it may transition from one state to another. Using the `onTransitionStart()` hook, a
FulfillmentProcess can perform checks before allowing a state transition to occur, and the `onTransitionEnd()`
hook allows logic to be executed after a state change.

For detailed description of the interface members, see the <a href='/reference/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a> docs.

```ts title="Signature"
interface FulfillmentProcess<State extends keyof CustomFulfillmentStates | string> extends InjectableStrategy {
    transitions?: Transitions<State, State | FulfillmentState> &
        Partial<Transitions<FulfillmentState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | FulfillmentState, FulfillmentTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | FulfillmentState, FulfillmentTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | FulfillmentState>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### transitions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;State, State | <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>&#62; &#38;         Partial&#60;<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;<a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a> | State&#62;&#62;`}   />


### onTransitionStart

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;State | <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, <a href='/reference/typescript-api/fulfillment/fulfillment-transition-data#fulfillmenttransitiondata'>FulfillmentTransitionData</a>&#62;`}   />


### onTransitionEnd

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;State | <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, <a href='/reference/typescript-api/fulfillment/fulfillment-transition-data#fulfillmenttransitiondata'>FulfillmentTransitionData</a>&#62;`}   />


### onTransitionError

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;State | <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>&#62;`}   />




</div>
