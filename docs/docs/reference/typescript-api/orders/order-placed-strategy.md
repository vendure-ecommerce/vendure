---
title: "OrderPlacedStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderPlacedStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-placed-strategy.ts" sourceLine="24" packageName="@vendure/core" />

This strategy is responsible for deciding at which stage in the order process
the Order will be set as "placed" (i.e. the Customer has checked out, and
next it must be processed by an Administrator).

By default, the order is set as "placed" when it transitions from
'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

:::info

This is configured via the `orderOptions.orderPlacedStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface OrderPlacedStrategy extends InjectableStrategy {
    shouldSetAsPlaced(
        ctx: RequestContext,
        fromState: OrderState,
        toState: OrderState,
        order: Order,
    ): boolean | Promise<boolean>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### shouldSetAsPlaced

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;`}   />

This method is called whenever an _active_ Order transitions from one state to another.
If it resolves to `true`, then the Order will be set as "placed", which means:

* Order.active = false
* Order.placedAt = new Date()
* Any active Promotions are linked to the Order


</div>
