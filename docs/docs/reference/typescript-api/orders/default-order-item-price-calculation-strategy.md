---
title: "DefaultOrderItemPriceCalculationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultOrderItemPriceCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/default-order-item-price-calculation-strategy.ts" sourceLine="14" packageName="@vendure/core" />

The default <a href='/reference/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>, which simply passes through the price of
the ProductVariant without performing any calculations

```ts title="Signature"
class DefaultOrderItemPriceCalculationStrategy implements OrderItemPriceCalculationStrategy {
    calculateUnitPrice(ctx: RequestContext, productVariant: ProductVariant) => PriceCalculationResult | Promise<PriceCalculationResult>;
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a></code>



<div className="members-wrapper">

### calculateUnitPrice

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => <a href='/reference/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a> | Promise&#60;<a href='/reference/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;`}   />




</div>
