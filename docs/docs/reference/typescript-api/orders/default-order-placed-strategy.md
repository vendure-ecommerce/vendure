---
title: "DefaultOrderPlacedStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultOrderPlacedStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/default-order-placed-strategy.ts" sourceLine="14" packageName="@vendure/core" />

The default <a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>. The order is set as "placed" when it transitions from
'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

```ts title="Signature"
class DefaultOrderPlacedStrategy implements OrderPlacedStrategy {
    shouldSetAsPlaced(ctx: RequestContext, fromState: OrderState, toState: OrderState, order: Order) => boolean;
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a></code>



<div className="members-wrapper">

### shouldSetAsPlaced

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => boolean`}   />




</div>
