---
title: "StockAllocationStrategy"
weight: 10
date: 2023-07-20T13:56:14.634Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockAllocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/stock-allocation-strategy.ts" sourceLine="13" packageName="@vendure/core" />

This strategy is responsible for deciding at which stage in the order process
stock will be allocated.

```ts title="Signature"
interface StockAllocationStrategy extends InjectableStrategy {
  shouldAllocateStock(
        ctx: RequestContext,
        fromState: OrderState,
        toState: OrderState,
        order: Order,
    ): boolean | Promise<boolean>;
}
```
Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>



### shouldAllocateStock

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;"   />

This method is called whenever an Order transitions from one state to another.
If it resolves to `true`, then stock will be allocated for this order.
