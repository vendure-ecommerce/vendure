---
title: "DefaultShippingLineAssignmentStrategy"
weight: 10
date: 2023-07-14T16:57:49.698Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultShippingLineAssignmentStrategy
<div class="symbol">


# DefaultShippingLineAssignmentStrategy

{{< generation-info sourceFile="packages/core/src/config/shipping-method/default-shipping-line-assignment-strategy.ts" sourceLine="16" packageName="@vendure/core" since="2.0.0">}}

This is the default <a href='/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a> which simply assigns all OrderLines to the
ShippingLine, and is suitable for the most common scenario of a single shipping method per Order.

## Signature

```TypeScript
class DefaultShippingLineAssignmentStrategy implements ShippingLineAssignmentStrategy {
  assignShippingLineToOrderLines(ctx: RequestContext, shippingLine: ShippingLine, order: Order) => OrderLine[] | Promise<OrderLine[]>;
}
```
## Implements

 * <a href='/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a>


## Members

### assignShippingLineToOrderLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, shippingLine: <a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[] | Promise&#60;<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
