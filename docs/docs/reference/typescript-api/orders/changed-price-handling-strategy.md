---
title: "ChangedPriceHandlingStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ChangedPriceHandlingStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/changed-price-handling-strategy.ts" sourceLine="24" packageName="@vendure/core" />

This strategy defines how we handle the situation where an item exists in an Order, and
then later on another is added but in the meantime the price of the ProductVariant has changed.

By default, the latest price will be used. Any price changes resulting from using a newer price
will be reflected in the GraphQL `OrderLine.unitPrice[WithTax]ChangeSinceAdded` field.

:::info

This is configured via the `orderOptions.changedPriceHandlingStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface ChangedPriceHandlingStrategy extends InjectableStrategy {
    handlePriceChange(
        ctx: RequestContext,
        current: PriceCalculationResult,
        orderLine: OrderLine,
        order: Order,
    ): PriceCalculationResult | Promise<PriceCalculationResult>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### handlePriceChange

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, current: <a href='/reference/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a> | Promise&#60;<a href='/reference/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;`}   />

This method is called when adding to or adjusting OrderLines, if the latest price
(as determined by the ProductVariant price, potentially modified by the configured
<a href='/reference/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>) differs from the initial price at the time
that the OrderLine was created.


</div>
