---
title: "OrderByCodeAccessStrategy"
weight: 10
date: 2023-07-14T16:57:49.618Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderByCodeAccessStrategy
<div class="symbol">


# OrderByCodeAccessStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-by-code-access-strategy.ts" sourceLine="31" packageName="@vendure/core" since="1.1.0">}}

The OrderByCodeAccessStrategy determines how access to a placed Order via the
orderByCode query is granted.
With a custom strategy anonymous access could be made permanent or tied to specific
conditions like IP range or an Order status.

*Example*

This example grants access to the requested Order to anyone – unless it's Monday.
```TypeScript
export class NotMondayOrderByCodeAccessStrategy implements OrderByCodeAccessStrategy {
    canAccessOrder(ctx: RequestContext, order: Order): boolean {
        const MONDAY = 1;
        const today = (new Date()).getDay();

        return today !== MONDAY;
    }
}
```

## Signature

```TypeScript
interface OrderByCodeAccessStrategy extends InjectableStrategy {
  canAccessOrder(ctx: RequestContext, order: Order): boolean | Promise<boolean>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### canAccessOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;"  >}}

{{< member-description >}}Gives or denies permission to access the requested Order{{< /member-description >}}


</div>
<div class="symbol">


# DefaultOrderByCodeAccessStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-by-code-access-strategy.ts" sourceLine="50" packageName="@vendure/core">}}

The default OrderByCodeAccessStrategy used by Vendure. It permitts permanent access to
the Customer owning the Order and anyone within a given time period after placing the Order
(defaults to 2h).

## Signature

```TypeScript
class DefaultOrderByCodeAccessStrategy implements OrderByCodeAccessStrategy {
  constructor(anonymousAccessDuration: string)
  canAccessOrder(ctx: RequestContext, order: Order) => boolean;
}
```
## Implements

 * <a href='/typescript-api/orders/order-by-code-access-strategy#orderbycodeaccessstrategy'>OrderByCodeAccessStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(anonymousAccessDuration: string) => DefaultOrderByCodeAccessStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### canAccessOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
