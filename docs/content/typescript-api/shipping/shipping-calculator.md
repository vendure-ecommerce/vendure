---
title: "ShippingCalculator"
weight: 10
date: 2023-07-14T16:57:49.700Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingCalculator
<div class="symbol">


# ShippingCalculator

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-calculator.ts" sourceLine="48" packageName="@vendure/core">}}

The ShippingCalculator is used by a <a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> to calculate the price of shipping on a given <a href='/typescript-api/entities/order#order'>Order</a>.

*Example*

```ts
const flatRateCalculator = new ShippingCalculator({
  code: 'flat-rate-calculator',
  description: [{ languageCode: LanguageCode.en, value: 'Default Flat-Rate Shipping Calculator' }],
  args: {
    rate: {
      type: 'int',
      ui: { component: 'currency-form-input' },
    },
    taxRate: {
      type: 'int',
      ui: { component: 'number-form-input', suffix: '%' },
    },
  },
  calculate: (order, args) => {
    return {
      price: args.rate,
      taxRate: args.taxRate,
      priceIncludesTax: ctx.channel.pricesIncludeTax,
    };
  },
});
```

## Signature

```TypeScript
class ShippingCalculator<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
  constructor(config: ShippingCalculatorConfig<T>)
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;


## Members

### constructor

{{< member-info kind="method" type="(config: ShippingCalculatorConfig&#60;T&#62;) => ShippingCalculator"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ShippingCalculationResult

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-calculator.ts" sourceLine="74" packageName="@vendure/core">}}

The return value of the <a href='/typescript-api/shipping/shipping-calculator#calculateshippingfn'>CalculateShippingFn</a>.

## Signature

```TypeScript
interface ShippingCalculationResult {
  price: number;
  priceIncludesTax: boolean;
  taxRate: number;
  metadata?: Record<string, any>;
}
```
## Members

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The shipping price without any taxes.{{< /member-description >}}

### priceIncludesTax

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}Whether or not the given price already includes taxes.{{< /member-description >}}

### taxRate

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The tax rate applied to the shipping price.{{< /member-description >}}

### metadata

{{< member-info kind="property" type="Record&#60;string, any&#62;"  >}}

{{< member-description >}}Arbitrary metadata may be returned from the calculation function. This can be used
e.g. to return data on estimated delivery times or any other data which may be
needed in the storefront application when listing eligible shipping methods.{{< /member-description >}}


</div>
<div class="symbol">


# CalculateShippingFn

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-calculator.ts" sourceLine="114" packageName="@vendure/core">}}

A function which implements the specific shipping calculation logic. It takes an <a href='/typescript-api/entities/order#order'>Order</a> and
an arguments object and should return the shipping price as an integer in cents.

Should return a <a href='/typescript-api/shipping/shipping-calculator#shippingcalculationresult'>ShippingCalculationResult</a> object.

## Signature

```TypeScript
type CalculateShippingFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: ShippingMethod
) => CalculateShippingFnResult
```
</div>
