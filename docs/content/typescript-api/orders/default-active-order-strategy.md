---
title: "DefaultActiveOrderStrategy"
weight: 10
date: 2023-07-14T16:57:49.582Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultActiveOrderStrategy
<div class="symbol">


# DefaultActiveOrderStrategy

{{< generation-info sourceFile="packages/core/src/config/order/default-active-order-strategy.ts" sourceLine="18" packageName="@vendure/core" since="1.9.0">}}

The default <a href='/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>, which uses the current <a href='/typescript-api/entities/session#session'>Session</a> to determine
the active Order, and requires no additional input in the Shop API since it is based on the
session which is part of the RequestContext.

## Signature

```TypeScript
class DefaultActiveOrderStrategy implements ActiveOrderStrategy {
  name: 'default-active-order-strategy';
  async init(injector: Injector) => ;
  createActiveOrder(ctx: RequestContext) => ;
  async determineActiveOrder(ctx: RequestContext) => ;
}
```
## Implements

 * <a href='/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>


## Members

### name

{{< member-info kind="property" type="'default-active-order-strategy'"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### createActiveOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### determineActiveOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
