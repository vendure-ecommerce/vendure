---
title: "FSM"
weight: 10
date: 2023-07-14T16:57:49.435Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FSM
<div class="symbol">


# FSM

{{< generation-info sourceFile="packages/core/src/common/finite-state-machine/finite-state-machine.ts" sourceLine="12" packageName="@vendure/core">}}

A simple type-safe finite state machine. This is used internally to control the Order process, ensuring that
the state of Orders, Payments, Fulfillments and Refunds follows a well-defined behaviour.

## Signature

```TypeScript
class FSM<T extends string, Data = any> {
  constructor(config: StateMachineConfig<T, Data>, initialState: T)
  initialState: T
  currentState: T
  async transitionTo(state: T, data: Data) => Promise<{ finalize: () => Promise<any> }>;
  jumpTo(state: T) => ;
  getNextStates() => readonly T[];
  canTransitionTo(state: T) => boolean;
}
```
## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/state-machine/state-machine-config#statemachineconfig'>StateMachineConfig</a>&#60;T, Data&#62;, initialState: T) => FSM"  >}}

{{< member-description >}}{{< /member-description >}}

### initialState

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}{{< /member-description >}}

### currentState

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}{{< /member-description >}}

### transitionTo

{{< member-info kind="method" type="(state: T, data: Data) => Promise&#60;{ finalize: () =&#62; Promise&#60;any&#62; }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### jumpTo

{{< member-info kind="method" type="(state: T) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getNextStates

{{< member-info kind="method" type="() => readonly T[]"  >}}

{{< member-description >}}{{< /member-description >}}

### canTransitionTo

{{< member-info kind="method" type="(state: T) => boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
