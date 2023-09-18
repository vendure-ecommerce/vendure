---
title: "DefaultStockAllocationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultStockAllocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/default-stock-allocation-strategy.ts" sourceLine="14" packageName="@vendure/core" />

Allocates stock when the Order transitions from `ArrangingPayment` to either
`PaymentAuthorized` or `PaymentSettled`.

```ts title="Signature"
class DefaultStockAllocationStrategy implements StockAllocationStrategy {
    shouldAllocateStock(ctx: RequestContext, fromState: OrderState, toState: OrderState, order: Order) => boolean | Promise<boolean>;
}
```
* Implements: <code><a href='/reference/typescript-api/orders/stock-allocation-strategy#stockallocationstrategy'>StockAllocationStrategy</a></code>



<div className="members-wrapper">

### shouldAllocateStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;`}   />




</div>
