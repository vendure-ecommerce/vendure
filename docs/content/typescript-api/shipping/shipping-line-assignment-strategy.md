---
title: "ShippingLineAssignmentStrategy"
weight: 10
date: 2023-07-14T16:57:49.707Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingLineAssignmentStrategy
<div class="symbol">


# ShippingLineAssignmentStrategy

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-line-assignment-strategy.ts" sourceLine="18" packageName="@vendure/core" since="2.0.0">}}

This strategy is used to assign a given <a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to one or more <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>s of the Order.
This allows you to set multiple shipping methods for a single order, each assigned a different subset of
OrderLines.

The <a href='/typescript-api/shipping/default-shipping-line-assignment-strategy#defaultshippinglineassignmentstrategy'>DefaultShippingLineAssignmentStrategy</a> simply assigns _all_ OrderLines, so is suitable for the
most common scenario of a single shipping method per Order.

## Signature

```TypeScript
interface ShippingLineAssignmentStrategy extends InjectableStrategy {
  assignShippingLineToOrderLines(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
    ): OrderLine[] | Promise<OrderLine[]>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### assignShippingLineToOrderLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, shippingLine: <a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[] | Promise&#60;<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
