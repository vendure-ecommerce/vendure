---
title: "Merge Strategies"
weight: 10
date: 2023-07-14T16:57:49.612Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Merge Strategies
<div class="symbol">


# MergeOrdersStrategy

{{< generation-info sourceFile="packages/core/src/config/order/merge-orders-strategy.ts" sourceLine="15" packageName="@vendure/core">}}

Merges both Orders. If the guest order contains items which are already in the
existing Order, the guest Order quantity will replace that of the existing Order.

## Signature

```TypeScript
class MergeOrdersStrategy implements OrderMergeStrategy {
  merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
## Implements

 * <a href='/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a>


## Members

### merge

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# UseExistingStrategy

{{< generation-info sourceFile="packages/core/src/config/order/use-existing-strategy.ts" sourceLine="13" packageName="@vendure/core">}}

The guest order is discarded and the existing order is used as the active order.

## Signature

```TypeScript
class UseExistingStrategy implements OrderMergeStrategy {
  merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
## Implements

 * <a href='/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a>


## Members

### merge

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# UseGuestIfExistingEmptyStrategy

{{< generation-info sourceFile="packages/core/src/config/order/use-guest-if-existing-empty-strategy.ts" sourceLine="13" packageName="@vendure/core">}}

If the existing order is empty, then the guest order is used. Otherwise the existing order is used.

## Signature

```TypeScript
class UseGuestIfExistingEmptyStrategy implements OrderMergeStrategy {
  merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
## Implements

 * <a href='/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a>


## Members

### merge

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# UseGuestStrategy

{{< generation-info sourceFile="packages/core/src/config/order/use-guest-strategy.ts" sourceLine="13" packageName="@vendure/core">}}

Any existing order is discarded and the guest order is set as the active order.

## Signature

```TypeScript
class UseGuestStrategy implements OrderMergeStrategy {
  merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order) => MergedOrderLine[];
}
```
## Implements

 * <a href='/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a>


## Members

### merge

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
