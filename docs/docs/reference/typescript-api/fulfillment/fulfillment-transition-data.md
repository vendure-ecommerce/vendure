---
title: "FulfillmentTransitionData"
weight: 10
date: 2023-07-20T13:56:15.877Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FulfillmentTransitionData

<GenerationInfo sourceFile="packages/core/src/service/helpers/fulfillment-state-machine/fulfillment-state.ts" sourceLine="42" packageName="@vendure/core" />

The data which is passed to the state transition handlers of the FulfillmentStateMachine.

```ts title="Signature"
interface FulfillmentTransitionData {
  ctx: RequestContext;
  orders: Order[];
  fulfillment: Fulfillment;
}
```

### ctx

<MemberInfo kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"   />


### orders

<MemberInfo kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>[]"   />


### fulfillment

<MemberInfo kind="property" type="<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>"   />


