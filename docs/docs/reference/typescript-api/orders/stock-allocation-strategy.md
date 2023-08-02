---
title: "StockAllocationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockAllocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/stock-allocation-strategy.ts" sourceLine="20" packageName="@vendure/core" />

This strategy is responsible for deciding at which stage in the order process
stock will be allocated.

:::info

This is configured via the `orderOptions.stockAllocationStrategy` property of
your VendureConfig.

:::

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
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### shouldAllocateStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;`}   />

This method is called whenever an Order transitions from one state to another.
If it resolves to `true`, then stock will be allocated for this order.


</div>
