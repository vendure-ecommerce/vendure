---
title: "OrderMergeStrategy"
weight: 10
date: 2023-07-14T16:57:49.641Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderMergeStrategy
<div class="symbol">


# OrderMergeStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-merge-strategy.ts" sourceLine="41" packageName="@vendure/core">}}

An OrderMergeStrategy defines what happens when a Customer with an existing Order
signs in with a guest Order, where both Orders may contain differing OrderLines.

Somehow these differing OrderLines need to be reconciled into a single collection
of OrderLines. The OrderMergeStrategy defines the rules governing this reconciliation.

## Signature

```TypeScript
interface OrderMergeStrategy extends InjectableStrategy {
  merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order): MergedOrderLine[];
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### merge

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]"  >}}

{{< member-description >}}Merges the lines of the guest Order with those of the existing Order which is associated
with the active customer.{{< /member-description >}}


</div>
<div class="symbol">


# MergedOrderLine

{{< generation-info sourceFile="packages/core/src/config/order/order-merge-strategy.ts" sourceLine="15" packageName="@vendure/core">}}

The result of the <a href='/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a> `merge` method.

## Signature

```TypeScript
interface MergedOrderLine {
  orderLineId: ID;
  quantity: number;
  customFields?: any;
}
```
## Members

### orderLineId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### quantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
