---
title: "FSM"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FSM

<GenerationInfo sourceFile="packages/core/src/common/finite-state-machine/finite-state-machine.ts" sourceLine="12" packageName="@vendure/core" />

A simple type-safe finite state machine. This is used internally to control the Order process, ensuring that
the state of Orders, Payments, Fulfillments and Refunds follows a well-defined behaviour.

```ts title="Signature"
class FSM<T extends string, Data = any> {
    constructor(config: StateMachineConfig<T, Data>, initialState: T)
    initialState: T
    currentState: T
    transitionTo(state: T, data: Data) => Promise<{ finalize: () => Promise<any> }>;
    jumpTo(state: T) => ;
    getNextStates() => readonly T[];
    canTransitionTo(state: T) => boolean;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a>&#60;T, Data&#62;, initialState: T) => FSM`}   />


### initialState

<MemberInfo kind="property" type={`T`}   />


### currentState

<MemberInfo kind="property" type={`T`}   />


### transitionTo

<MemberInfo kind="method" type={`(state: T, data: Data) => Promise&#60;{ finalize: () =&#62; Promise&#60;any&#62; }&#62;`}   />


### jumpTo

<MemberInfo kind="method" type={`(state: T) => `}   />


### getNextStates

<MemberInfo kind="method" type={`() => readonly T[]`}   />


### canTransitionTo

<MemberInfo kind="method" type={`(state: T) => boolean`}   />




</div>
