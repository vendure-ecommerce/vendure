---
title: "OrderPlacedStrategy"
weight: 10
date: 2023-07-14T16:57:49.644Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderPlacedStrategy
<div class="symbol">


# OrderPlacedStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-placed-strategy.ts" sourceLine="17" packageName="@vendure/core">}}

This strategy is responsible for deciding at which stage in the order process
the Order will be set as "placed" (i.e. the Customer has checked out, and
next it must be processed by an Administrator).

By default, the order is set as "placed" when it transitions from
'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

## Signature

```TypeScript
interface OrderPlacedStrategy extends InjectableStrategy {
  shouldSetAsPlaced(
        ctx: RequestContext,
        fromState: OrderState,
        toState: OrderState,
        order: Order,
    ): boolean | Promise<boolean>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### shouldSetAsPlaced

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;"  >}}

{{< member-description >}}This method is called whenever an _active_ Order transitions from one state to another.
If it resolves to `true`, then the Order will be set as "placed", which means:

* Order.active = false
* Order.placedAt = new Date()
* Any active Promotions are linked to the Order{{< /member-description >}}


</div>
