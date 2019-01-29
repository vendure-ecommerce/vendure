---
title: "OrderProcessOptions"
weight: 10
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# OrderProcessOptions



### transtitions

{{< member-info type="Partial&#60;Transitions&#60;T | OrderState&#62;&#62;" >}}

Define how the custom states fit in with the default orderstate transitions.

### onTransitionStart

{{< member-info type="(fromState: T, toState: T, data: { order: Order }) => boolean | Promise&#60;boolean&#62; | Observable&#60;boolean&#62; | void" >}}

Define logic to run before a state tranition takes place. Returningfalse will prevent the transition from going ahead.

### onTransitionEnd

{{< member-info type="(fromState: T, toState: T, data: { order: Order }) => void" >}}

Define logic to run after a state transition has taken place.

### onError

{{< member-info type="(fromState: T, toState: T, message: string) => void" >}}

Define a custom error handler function for transition errors.

