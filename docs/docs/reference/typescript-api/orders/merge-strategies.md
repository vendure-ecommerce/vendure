---
title: "Merge Strategies"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## MergeOrdersStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/merge-orders-strategy.ts" sourceLine="15" packageName="@vendure/core" />

Merges both Orders. If the guest order contains items which are already in the
existing Order, the guest Order quantity will replace that of the existing Order.

```ts title="Signature"
class MergeOrdersStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a></code>



<div className="members-wrapper">

### merge

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]`}   />




</div>


## UseExistingStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/use-existing-strategy.ts" sourceLine="13" packageName="@vendure/core" />

The guest order is discarded and the existing order is used as the active order.

```ts title="Signature"
class UseExistingStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a></code>



<div className="members-wrapper">

### merge

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]`}   />




</div>


## UseGuestIfExistingEmptyStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/use-guest-if-existing-empty-strategy.ts" sourceLine="13" packageName="@vendure/core" />

If the existing order is empty, then the guest order is used. Otherwise the existing order is used.

```ts title="Signature"
class UseGuestIfExistingEmptyStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a></code>



<div className="members-wrapper">

### merge

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]`}   />




</div>


## UseGuestStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/use-guest-strategy.ts" sourceLine="13" packageName="@vendure/core" />

Any existing order is discarded and the guest order is set as the active order.

```ts title="Signature"
class UseGuestStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a></code>



<div className="members-wrapper">

### merge

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]`}   />




</div>
