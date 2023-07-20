---
title: "ChangedPriceHandlingStrategy"
weight: 10
date: 2023-07-14T16:57:49.580Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ChangedPriceHandlingStrategy
<div class="symbol">


# ChangedPriceHandlingStrategy

{{< generation-info sourceFile="packages/core/src/config/order/changed-price-handling-strategy.ts" sourceLine="17" packageName="@vendure/core">}}

This strategy defines how we handle the situation where an item exists in an Order, and
then later on another is added but in the meantime the price of the ProductVariant has changed.

By default, the latest price will be used. Any price changes resulting from using a newer price
will be reflected in the GraphQL `OrderLine.unitPrice[WithTax]ChangeSinceAdded` field.

## Signature

```TypeScript
interface ChangedPriceHandlingStrategy extends InjectableStrategy {
  handlePriceChange(
        ctx: RequestContext,
        current: PriceCalculationResult,
        orderLine: OrderLine,
        order: Order,
    ): PriceCalculationResult | Promise<PriceCalculationResult>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### handlePriceChange

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, current: <a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>, orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a> | Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"  >}}

{{< member-description >}}This method is called when adding to or adjusting OrderLines, if the latest price
(as determined by the ProductVariant price, potentially modified by the configured
<a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>) differs from the initial price at the time
that the OrderLine was created.{{< /member-description >}}


</div>
