---
title: "StockAllocationStrategy"
weight: 10
date: 2023-07-14T16:57:49.646Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockAllocationStrategy
<div class="symbol">


# StockAllocationStrategy

{{< generation-info sourceFile="packages/core/src/config/order/stock-allocation-strategy.ts" sourceLine="13" packageName="@vendure/core">}}

This strategy is responsible for deciding at which stage in the order process
stock will be allocated.

## Signature

```TypeScript
interface StockAllocationStrategy extends InjectableStrategy {
  shouldAllocateStock(
        ctx: RequestContext,
        fromState: OrderState,
        toState: OrderState,
        order: Order,
    ): boolean | Promise<boolean>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### shouldAllocateStock

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;"  >}}

{{< member-description >}}This method is called whenever an Order transitions from one state to another.
If it resolves to `true`, then stock will be allocated for this order.{{< /member-description >}}


</div>
