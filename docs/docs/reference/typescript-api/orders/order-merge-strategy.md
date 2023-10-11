---
title: "OrderMergeStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderMergeStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-merge-strategy.ts" sourceLine="48" packageName="@vendure/core" />

An OrderMergeStrategy defines what happens when a Customer with an existing Order
signs in with a guest Order, where both Orders may contain differing OrderLines.

Somehow these differing OrderLines need to be reconciled into a single collection
of OrderLines. The OrderMergeStrategy defines the rules governing this reconciliation.

:::info

This is configured via the `orderOptions.mergeStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface OrderMergeStrategy extends InjectableStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order): MergedOrderLine[];
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### merge

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, guestOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>, existingOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/orders/order-merge-strategy#mergedorderline'>MergedOrderLine</a>[]`}   />

Merges the lines of the guest Order with those of the existing Order which is associated
with the active customer.


</div>


## MergedOrderLine

<GenerationInfo sourceFile="packages/core/src/config/order/order-merge-strategy.ts" sourceLine="15" packageName="@vendure/core" />

The result of the <a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a> `merge` method.

```ts title="Signature"
interface MergedOrderLine {
    orderLineId: ID;
    quantity: number;
    customFields?: any;
}
```

<div className="members-wrapper">

### orderLineId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### quantity

<MemberInfo kind="property" type={`number`}   />


### customFields

<MemberInfo kind="property" type={`any`}   />




</div>
