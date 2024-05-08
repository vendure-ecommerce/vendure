---
title: "OrderCalculator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderCalculator

<GenerationInfo sourceFile="packages/core/src/service/helpers/order-calculator/order-calculator.ts" sourceLine="33" packageName="@vendure/core" />

This helper is used when making changes to an Order, to apply all applicable price adjustments to that Order,
including:

- Promotions
- Taxes
- Shipping

```ts title="Signature"
class OrderCalculator {
    constructor(configService: ConfigService, zoneService: ZoneService, taxRateService: TaxRateService, shippingMethodService: ShippingMethodService, shippingCalculator: ShippingCalculator, requestContextCache: RequestContextCacheService)
    applyPriceAdjustments(ctx: RequestContext, order: Order, promotions: Promotion[], updatedOrderLines: OrderLine[] = [], options?: { recalculateShipping?: boolean }) => Promise<Order>;
    calculateOrderTotals(order: Order) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService, zoneService: <a href='/reference/typescript-api/services/zone-service#zoneservice'>ZoneService</a>, taxRateService: <a href='/reference/typescript-api/services/tax-rate-service#taxrateservice'>TaxRateService</a>, shippingMethodService: <a href='/reference/typescript-api/services/shipping-method-service#shippingmethodservice'>ShippingMethodService</a>, shippingCalculator: <a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>, requestContextCache: RequestContextCacheService) => OrderCalculator`}   />


### applyPriceAdjustments

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, promotions: <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[], updatedOrderLines: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[] = [], options?: { recalculateShipping?: boolean }) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Applies taxes and promotions to an Order. Mutates the order object.
Returns an array of any OrderItems which had new adjustments
applied, either tax or promotions.
### calculateOrderTotals

<MemberInfo kind="method" type={`(order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => `}   />

Sets the totals properties on an Order by summing each OrderLine, and taking
into account any Surcharges and ShippingLines. Does not save the Order, so
the entity must be persisted to the DB after calling this method.

Note that this method does *not* evaluate any taxes or promotions. It assumes
that has already been done and is solely responsible for summing the
totals.


</div>
