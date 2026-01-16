---
title: "StateMachineConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StateMachineConfig

<GenerationInfo sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="89" packageName="@vendure/core" />

The config object used to instantiate a new <a href='/reference/typescript-api/state-machine/fsm#fsm'>FSM</a> instance.

```ts title="Signature"
interface StateMachineConfig<T extends string, Data = undefined> {
    readonly transitions: Transitions<T>;
    onTransitionStart?: OnTransitionStartFn<T, Data>;
    onTransitionEnd?: OnTransitionEndFn<T, Data>;
    onError?: OnTransitionErrorFn<T>;
}
```

<div className="members-wrapper">

### transitions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;T&#62;`}   />

Defines the available states of the state machine as well as the permitted
transitions from one state to another.
### onTransitionStart

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;T, Data&#62;`}   />

Called before a transition takes place. If the function resolves to `false` or a string, then the transition
will be cancelled. In the case of a string, the string (error message) will be forwarded to the onError handler.

If this function returns a value resolving to `true` or `void` (no return value), then the transition
will be permitted.
### onTransitionEnd

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;T, Data&#62;`}   />

Called after a transition has taken place.
### onError

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;T&#62;`}   />

Called when a transition is prevented and the `onTransitionStart` handler has returned an
error message.


</div>


## OnTransitionStartFn

<GenerationInfo sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="48" packageName="@vendure/core" />

Called before a transition takes place. If the function resolves to `false` or a string, then the transition
will be cancelled. In the case of a string, the string (error message) will be forwarded to the onError handler.

If this function returns a value resolving to `true` or `void` (no return value), then the transition
will be permitted.

```ts title="Signature"
type OnTransitionStartFn<T extends string, Data> = (
    fromState: T,
    toState: T,
    data: Data,
) => boolean | string | void | Promise<boolean | string | void> | Observable<boolean | string | void>
```


## OnTransitionErrorFn

<GenerationInfo sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="62" packageName="@vendure/core" />

Called when a transition is prevented and the `onTransitionStart` handler has returned an
error message.

```ts title="Signature"
type OnTransitionErrorFn<T extends string> = (
    fromState: T,
    toState: T,
    message?: string,
) => void | Promise<void> | Observable<void>
```


## OnTransitionEndFn

<GenerationInfo sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="75" packageName="@vendure/core" />

Called after a transition has taken place.

```ts title="Signature"
type OnTransitionEndFn<T extends string, Data> = (
    fromState: T,
    toState: T,
    data: Data,
) => void | Promise<void> | Observable<void>
```
