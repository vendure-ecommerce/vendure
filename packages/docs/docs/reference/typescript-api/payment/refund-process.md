---
title: "RefundProcess"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RefundProcess

<GenerationInfo sourceFile="packages/core/src/config/refund/refund-process.ts" sourceLine="25" packageName="@vendure/core" />

A RefundProcess is used to define the way the refund process works as in: what states a Refund can be
in, and how it may transition from one state to another. Using the `onTransitionStart()` hook, a
RefundProcess can perform checks before allowing a state transition to occur, and the `onTransitionEnd()`
hook allows logic to be executed after a state change.

For detailed description of the interface members, see the <a href='/reference/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a> docs.

```ts title="Signature"
interface RefundProcess<State extends keyof CustomRefundStates | string> extends InjectableStrategy {
    transitions?: Transitions<State, State | RefundState> & Partial<Transitions<RefundState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | RefundState, RefundTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | RefundState, RefundTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | RefundState>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### transitions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;State, State | <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>&#62; &#38; Partial&#60;<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;<a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a> | State&#62;&#62;`}   />


### onTransitionStart

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;State | <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>, <a href='/reference/typescript-api/payment/refund-transition-data#refundtransitiondata'>RefundTransitionData</a>&#62;`}   />


### onTransitionEnd

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;State | <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>, <a href='/reference/typescript-api/payment/refund-transition-data#refundtransitiondata'>RefundTransitionData</a>&#62;`}   />


### onTransitionError

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;State | <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>&#62;`}   />




</div>
