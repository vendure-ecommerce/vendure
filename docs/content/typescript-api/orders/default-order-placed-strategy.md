---
title: "DefaultOrderPlacedStrategy"
weight: 10
date: 2023-07-14T16:57:49.590Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultOrderPlacedStrategy
<div class="symbol">


# DefaultOrderPlacedStrategy

{{< generation-info sourceFile="packages/core/src/config/order/default-order-placed-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

The default <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>. The order is set as "placed" when it transitions from
'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

## Signature

```TypeScript
class DefaultOrderPlacedStrategy implements OrderPlacedStrategy {
  shouldSetAsPlaced(ctx: RequestContext, fromState: OrderState, toState: OrderState, order: Order) => boolean;
}
```
## Implements

 * <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>


## Members

### shouldSetAsPlaced

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
