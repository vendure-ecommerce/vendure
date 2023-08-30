---
title: "FulfillmentState"
weight: 10
date: 2023-07-14T16:57:50.235Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FulfillmentState
<div class="symbol">


# FulfillmentState

{{< generation-info sourceFile="packages/core/src/service/helpers/fulfillment-state-machine/fulfillment-state.ts" sourceLine="29" packageName="@vendure/core">}}

These are the default states of the fulfillment process. By default, they will be extended
by the <a href='/typescript-api/fulfillment/fulfillment-process#defaultfulfillmentprocess'>defaultFulfillmentProcess</a> to also include `Shipped` and `Delivered`.

## Signature

```TypeScript
type FulfillmentState = | 'Created'
    | 'Pending'
    | 'Cancelled'
    | keyof CustomFulfillmentStates
    | keyof FulfillmentStates
```
</div>
