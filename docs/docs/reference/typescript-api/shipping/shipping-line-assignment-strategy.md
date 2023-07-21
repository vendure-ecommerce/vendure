---
title: "ShippingLineAssignmentStrategy"
weight: 10
date: 2023-07-21T07:17:00.507Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingLineAssignmentStrategy

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-line-assignment-strategy.ts" sourceLine="18" packageName="@vendure/core" since="2.0.0" />

This strategy is used to assign a given <a href='/docs/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to one or more <a href='/docs/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>s of the Order.
This allows you to set multiple shipping methods for a single order, each assigned a different subset of
OrderLines.

The <a href='/docs/reference/typescript-api/shipping/default-shipping-line-assignment-strategy#defaultshippinglineassignmentstrategy'>DefaultShippingLineAssignmentStrategy</a> simply assigns _all_ OrderLines, so is suitable for the
most common scenario of a single shipping method per Order.

```ts title="Signature"
interface ShippingLineAssignmentStrategy extends InjectableStrategy {
  assignShippingLineToOrderLines(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
    ): OrderLine[] | Promise<OrderLine[]>;
}
```
* Extends: <code><a href='/docs/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### assignShippingLineToOrderLines

<MemberInfo kind="method" type="(ctx: <a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, shippingLine: <a href='/docs/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>, order: <a href='/docs/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/docs/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[] | Promise&#60;<a href='/docs/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]&#62;"   />




</div>
