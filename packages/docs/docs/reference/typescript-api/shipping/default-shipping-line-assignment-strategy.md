---
title: "DefaultShippingLineAssignmentStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultShippingLineAssignmentStrategy

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/default-shipping-line-assignment-strategy.ts" sourceLine="16" packageName="@vendure/core" since="2.0.0" />

This is the default <a href='/reference/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a> which simply assigns all OrderLines to the
ShippingLine, and is suitable for the most common scenario of a single shipping method per Order.

```ts title="Signature"
class DefaultShippingLineAssignmentStrategy implements ShippingLineAssignmentStrategy {
    assignShippingLineToOrderLines(ctx: RequestContext, shippingLine: ShippingLine, order: Order) => OrderLine[] | Promise<OrderLine[]>;
}
```
* Implements: <code><a href='/reference/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a></code>



<div className="members-wrapper">

### assignShippingLineToOrderLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, shippingLine: <a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[] | Promise&#60;<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]&#62;`}   />




</div>
