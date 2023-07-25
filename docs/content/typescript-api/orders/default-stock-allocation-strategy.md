---
title: "DefaultStockAllocationStrategy"
weight: 10
date: 2023-07-14T16:57:49.608Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultStockAllocationStrategy
<div class="symbol">


# DefaultStockAllocationStrategy

{{< generation-info sourceFile="packages/core/src/config/order/default-stock-allocation-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

Allocates stock when the Order transitions from `ArrangingPayment` to either
`PaymentAuthorized` or `PaymentSettled`.

## Signature

```TypeScript
class DefaultStockAllocationStrategy implements StockAllocationStrategy {
  shouldAllocateStock(ctx: RequestContext, fromState: OrderState, toState: OrderState, order: Order) => boolean | Promise<boolean>;
}
```
## Implements

 * <a href='/typescript-api/orders/stock-allocation-strategy#stockallocationstrategy'>StockAllocationStrategy</a>


## Members

### shouldAllocateStock

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
