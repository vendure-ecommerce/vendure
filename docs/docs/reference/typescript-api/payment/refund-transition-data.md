---
title: "RefundTransitionData"
weight: 10
date: 2023-07-21T07:17:01.597Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RefundTransitionData

<GenerationInfo sourceFile="packages/core/src/service/helpers/refund-state-machine/refund-state.ts" sourceLine="33" packageName="@vendure/core" />

The data which is passed to the state transition handlers of the RefundStateMachine.

```ts title="Signature"
interface RefundTransitionData {
  ctx: RequestContext;
  order: Order;
  refund: Refund;
}
```

<div className="members-wrapper">

### ctx

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>"   />


### order

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/entities/order#order'>Order</a>"   />


### refund

<MemberInfo kind="property" type="Refund"   />




</div>
