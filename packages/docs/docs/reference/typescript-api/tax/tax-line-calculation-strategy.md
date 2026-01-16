---
title: "TaxLineCalculationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxLineCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/tax/tax-line-calculation-strategy.ts" sourceLine="29" packageName="@vendure/core" />

This strategy defines how the TaxLines on OrderItems are calculated. By default,
the <a href='/reference/typescript-api/tax/default-tax-line-calculation-strategy#defaulttaxlinecalculationstrategy'>DefaultTaxLineCalculationStrategy</a> is used, which directly applies
a single TaxLine based on the applicable <a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>.

However, custom strategies may use any suitable method for calculating TaxLines.
For example, a third-party tax API or a lookup of a custom tax table may be used.

:::info

This is configured via the `taxOptions.taxLineCalculationStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface TaxLineCalculationStrategy extends InjectableStrategy {
    calculate(args: CalculateTaxLinesArgs): TaxLine[] | Promise<TaxLine[]>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### calculate

<MemberInfo kind="method" type={`(args: <a href='/reference/typescript-api/tax/tax-line-calculation-strategy#calculatetaxlinesargs'>CalculateTaxLinesArgs</a>) => TaxLine[] | Promise&#60;TaxLine[]&#62;`}   />

This method is called when calculating the Order prices. Since it will be called
whenever an Order is modified in some way (adding/removing items, applying promotions,
setting ShippingMethod etc), care should be taken so that calling the function does
not adversely impact overall performance. For example, by using caching and only
calling external APIs when absolutely necessary.


</div>


## CalculateTaxLinesArgs

<GenerationInfo sourceFile="packages/core/src/config/tax/tax-line-calculation-strategy.ts" sourceLine="47" packageName="@vendure/core" />



```ts title="Signature"
interface CalculateTaxLinesArgs {
    ctx: RequestContext;
    order: Order;
    orderLine: OrderLine;
    applicableTaxRate: TaxRate;
}
```

<div className="members-wrapper">

### ctx

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### orderLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>`}   />


### applicableTaxRate

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>`}   />




</div>
