---
title: "StateMachineConfig"
weight: 10
date: 2023-07-14T16:57:49.439Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StateMachineConfig
<div class="symbol">


# StateMachineConfig

{{< generation-info sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="89" packageName="@vendure/core">}}

The config object used to instantiate a new <a href='/typescript-api/state-machine/fsm#fsm'>FSM</a> instance.

## Signature

```TypeScript
interface StateMachineConfig<T extends string, Data = undefined> {
  readonly transitions: Transitions<T>;
  onTransitionStart?: OnTransitionStartFn<T, Data>;
  onTransitionEnd?: OnTransitionEndFn<T, Data>;
  onError?: OnTransitionErrorFn<T>;
}
```
## Members

### transitions

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/transitions#transitions'>Transitions</a>&#60;T&#62;"  >}}

{{< member-description >}}Defines the available states of the state machine as well as the permitted
transitions from one state to another.{{< /member-description >}}

### onTransitionStart

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;T, Data&#62;"  >}}

{{< member-description >}}Called before a transition takes place. If the function resolves to `false` or a string, then the transition
will be cancelled. In the case of a string, the string (error message) will be forwarded to the onError handler.

If this function returns a value resolving to `true` or `void` (no return value), then the transition
will be permitted.{{< /member-description >}}

### onTransitionEnd

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionendfn'>OnTransitionEndFn</a>&#60;T, Data&#62;"  >}}

{{< member-description >}}Called after a transition has taken place.{{< /member-description >}}

### onError

{{< member-info kind="property" type="<a href='/typescript-api/state-machine/state-machine-config#ontransitionerrorfn'>OnTransitionErrorFn</a>&#60;T&#62;"  >}}

{{< member-description >}}Called when a transition is prevented and the `onTransitionStart` handler has returned an
error message.{{< /member-description >}}


</div>
<div class="symbol">


# OnTransitionStartFn

{{< generation-info sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="48" packageName="@vendure/core">}}

Called before a transition takes place. If the function resolves to `false` or a string, then the transition
will be cancelled. In the case of a string, the string (error message) will be forwarded to the onError handler.

If this function returns a value resolving to `true` or `void` (no return value), then the transition
will be permitted.

## Signature

```TypeScript
type OnTransitionStartFn<T extends string, Data> = (
    fromState: T,
    toState: T,
    data: Data,
) => boolean | string | void | Promise<boolean | string | void> | Observable<boolean | string | void>
```
</div>
<div class="symbol">


# OnTransitionErrorFn

{{< generation-info sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="62" packageName="@vendure/core">}}

Called when a transition is prevented and the `onTransitionStart` handler has returned an
error message.

## Signature

```TypeScript
type OnTransitionErrorFn<T extends string> = (
    fromState: T,
    toState: T,
    message?: string,
) => void | Promise<void> | Observable<void>
```
</div>
<div class="symbol">


# OnTransitionEndFn

{{< generation-info sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="75" packageName="@vendure/core">}}

Called after a transition has taken place.

## Signature

```TypeScript
type OnTransitionEndFn<T extends string, Data> = (
    fromState: T,
    toState: T,
    data: Data,
) => void | Promise<void> | Observable<void>
```
</div>
