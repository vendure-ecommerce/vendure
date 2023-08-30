---
title: "TaxZoneStrategy"
weight: 10
date: 2023-07-14T16:57:49.715Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxZoneStrategy
<div class="symbol">


# TaxZoneStrategy

{{< generation-info sourceFile="packages/core/src/config/tax/tax-zone-strategy.ts" sourceLine="21" packageName="@vendure/core">}}

Defines how the active <a href='/typescript-api/entities/zone#zone'>Zone</a> is determined for the purposes of calculating taxes.

This strategy is used in 2 scenarios:

1. To determine the applicable Zone when calculating the taxRate to apply when displaying ProductVariants. In this case the
`order` argument will be undefined, as the request is not related to a specific Order.
2. To determine the applicable Zone when calculating the taxRate on the contents of a specific Order. In this case the
`order` argument _will_ be defined, and can be used in the logic. For example, the shipping address can be taken into account.

Note that this method is called very often in a typical user session, so any work it performs should be designed with as little
performance impact as possible.

## Signature

```TypeScript
interface TaxZoneStrategy extends InjectableStrategy {
  determineTaxZone(
        ctx: RequestContext,
        zones: Zone[],
        channel: Channel,
        order?: Order,
    ): Zone | Promise<Zone> | undefined;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### determineTaxZone

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zones: <a href='/typescript-api/entities/zone#zone'>Zone</a>[], channel: <a href='/typescript-api/entities/channel#channel'>Channel</a>, order?: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/entities/zone#zone'>Zone</a> | Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62; | undefined"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
