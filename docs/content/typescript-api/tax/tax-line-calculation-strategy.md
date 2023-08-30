---
title: "TaxLineCalculationStrategy"
weight: 10
date: 2023-07-14T16:57:49.712Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxLineCalculationStrategy
<div class="symbol">


# TaxLineCalculationStrategy

{{< generation-info sourceFile="packages/core/src/config/tax/tax-line-calculation-strategy.ts" sourceLine="22" packageName="@vendure/core">}}

This strategy defines how the TaxLines on OrderItems are calculated. By default,
the <a href='/typescript-api/tax/default-tax-line-calculation-strategy#defaulttaxlinecalculationstrategy'>DefaultTaxLineCalculationStrategy</a> is used, which directly applies
a single TaxLine based on the applicable <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>.

However, custom strategies may use any suitable method for calculating TaxLines.
For example, a third-party tax API or a lookup of a custom tax table may be used.

## Signature

```TypeScript
interface TaxLineCalculationStrategy extends InjectableStrategy {
  calculate(args: CalculateTaxLinesArgs): TaxLine[] | Promise<TaxLine[]>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### calculate

{{< member-info kind="method" type="(args: <a href='/typescript-api/tax/tax-line-calculation-strategy#calculatetaxlinesargs'>CalculateTaxLinesArgs</a>) => TaxLine[] | Promise&#60;TaxLine[]&#62;"  >}}

{{< member-description >}}This method is called when calculating the Order prices. Since it will be called
whenever an Order is modified in some way (adding/removing items, applying promotions,
setting ShippingMethod etc), care should be taken so that calling the function does
not adversely impact overall performance. For example, by using caching and only
calling external APIs when absolutely necessary.{{< /member-description >}}


</div>
<div class="symbol">


# CalculateTaxLinesArgs

{{< generation-info sourceFile="packages/core/src/config/tax/tax-line-calculation-strategy.ts" sourceLine="40" packageName="@vendure/core">}}



## Signature

```TypeScript
interface CalculateTaxLinesArgs {
  ctx: RequestContext;
  order: Order;
  orderLine: OrderLine;
  applicableTaxRate: TaxRate;
}
```
## Members

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### applicableTaxRate

{{< member-info kind="property" type="<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
