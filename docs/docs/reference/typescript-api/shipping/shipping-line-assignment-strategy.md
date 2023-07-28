---
title: "ShippingLineAssignmentStrategy"
weight: 10
date: 2023-07-28T12:05:22.357Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingLineAssignmentStrategy

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-line-assignment-strategy.ts" sourceLine="25" packageName="@vendure/core" since="2.0.0" />

This strategy is used to assign a given <a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to one or more <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>s of the Order.
This allows you to set multiple shipping methods for a single order, each assigned a different subset of
OrderLines.

The <a href='/reference/typescript-api/shipping/default-shipping-line-assignment-strategy#defaultshippinglineassignmentstrategy'>DefaultShippingLineAssignmentStrategy</a> simply assigns _all_ OrderLines, so is suitable for the
most common scenario of a single shipping method per Order.

:::info

This is configured via the `shippingOptions.shippingLineAssignmentStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface ShippingLineAssignmentStrategy extends InjectableStrategy {
  assignShippingLineToOrderLines(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
    ): OrderLine[] | Promise<OrderLine[]>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### assignShippingLineToOrderLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, shippingLine: <a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[] | Promise&#60;<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]&#62;`}   />




</div>
