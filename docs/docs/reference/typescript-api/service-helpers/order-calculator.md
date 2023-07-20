---
title: "OrderCalculator"
weight: 10
date: 2023-07-14T16:57:50.243Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderCalculator
<div class="symbol">


# OrderCalculator

{{< generation-info sourceFile="packages/core/src/service/helpers/order-calculator/order-calculator.ts" sourceLine="32" packageName="@vendure/core">}}

This helper is used when making changes to an Order, to apply all applicable price adjustments to that Order,
including:

- Promotions
- Taxes
- Shipping

## Signature

```TypeScript
class OrderCalculator {
  constructor(configService: ConfigService, zoneService: ZoneService, taxRateService: TaxRateService, shippingMethodService: ShippingMethodService, shippingCalculator: ShippingCalculator, requestContextCache: RequestContextCacheService)
  async applyPriceAdjustments(ctx: RequestContext, order: Order, promotions: Promotion[], updatedOrderLines: OrderLine[] = [], options?: { recalculateShipping?: boolean }) => Promise<Order>;
  public calculateOrderTotals(order: Order) => ;
}
```
## Members

### constructor

{{< member-info kind="method" type="(configService: ConfigService, zoneService: <a href='/typescript-api/services/zone-service#zoneservice'>ZoneService</a>, taxRateService: <a href='/typescript-api/services/tax-rate-service#taxrateservice'>TaxRateService</a>, shippingMethodService: <a href='/typescript-api/services/shipping-method-service#shippingmethodservice'>ShippingMethodService</a>, shippingCalculator: <a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>, requestContextCache: RequestContextCacheService) => OrderCalculator"  >}}

{{< member-description >}}{{< /member-description >}}

### applyPriceAdjustments

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, promotions: <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>[], updatedOrderLines: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[] = [], options?: { recalculateShipping?: boolean }) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Applies taxes and promotions to an Order. Mutates the order object.
Returns an array of any OrderItems which had new adjustments
applied, either tax or promotions.{{< /member-description >}}

### calculateOrderTotals

{{< member-info kind="method" type="(order: <a href='/typescript-api/entities/order#order'>Order</a>) => "  >}}

{{< member-description >}}Sets the totals properties on an Order by summing each OrderLine, and taking
into account any Surcharges and ShippingLines. Does not save the Order, so
the entity must be persisted to the DB after calling this method.

Note that this method does *not* evaluate any taxes or promotions. It assumes
that has already been done and is solely responsible for summing the
totals.{{< /member-description >}}


</div>
