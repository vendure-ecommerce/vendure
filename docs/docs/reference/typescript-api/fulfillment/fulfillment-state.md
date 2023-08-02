---
title: "FulfillmentState"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FulfillmentState

<GenerationInfo sourceFile="packages/core/src/service/helpers/fulfillment-state-machine/fulfillment-state.ts" sourceLine="29" packageName="@vendure/core" />

These are the default states of the fulfillment process. By default, they will be extended
by the <a href='/reference/typescript-api/fulfillment/fulfillment-process#defaultfulfillmentprocess'>defaultFulfillmentProcess</a> to also include `Shipped` and `Delivered`.

```ts title="Signature"
type FulfillmentState = | 'Created'
    | 'Pending'
    | 'Cancelled'
    | keyof CustomFulfillmentStates
    | keyof FulfillmentStates
```
