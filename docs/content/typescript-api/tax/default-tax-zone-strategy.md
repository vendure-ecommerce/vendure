---
title: "DefaultTaxZoneStrategy"
weight: 10
date: 2023-07-14T16:57:49.710Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultTaxZoneStrategy
<div class="symbol">


# DefaultTaxZoneStrategy

{{< generation-info sourceFile="packages/core/src/config/tax/default-tax-zone-strategy.ts" sourceLine="12" packageName="@vendure/core">}}

A default method of determining Zone for tax calculations.

## Signature

```TypeScript
class DefaultTaxZoneStrategy implements TaxZoneStrategy {
  determineTaxZone(ctx: RequestContext, zones: Zone[], channel: Channel, order?: Order) => Zone;
}
```
## Implements

 * <a href='/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a>


## Members

### determineTaxZone

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zones: <a href='/typescript-api/entities/zone#zone'>Zone</a>[], channel: <a href='/typescript-api/entities/channel#channel'>Channel</a>, order?: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/entities/zone#zone'>Zone</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
