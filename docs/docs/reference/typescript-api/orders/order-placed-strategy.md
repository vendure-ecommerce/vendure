---
title: "OrderPlacedStrategy"
weight: 10
date: 2023-07-20T13:56:14.630Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderPlacedStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-placed-strategy.ts" sourceLine="17" packageName="@vendure/core" />

This strategy is responsible for deciding at which stage in the order process
the Order will be set as "placed" (i.e. the Customer has checked out, and
next it must be processed by an Administrator).

By default, the order is set as "placed" when it transitions from
'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

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
Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>



### shouldSetAsPlaced

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;"   />

This method is called whenever an _active_ Order transitions from one state to another.
If it resolves to `true`, then the Order will be set as "placed", which means:

* Order.active = false
* Order.placedAt = new Date()
* Any active Promotions are linked to the Order
