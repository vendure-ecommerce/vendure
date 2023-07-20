---
title: "ShippingCalculator"
weight: 10
date: 2023-07-20T13:56:14.756Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingCalculator

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-calculator.ts" sourceLine="48" packageName="@vendure/core" />

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

```ts title="Signature"
class ShippingCalculator<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
  constructor(config: ShippingCalculatorConfig<T>)
}
```
Extends

 * <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;



### constructor

<MemberInfo kind="method" type="(config: ShippingCalculatorConfig&#60;T&#62;) => ShippingCalculator"   />




## ShippingCalculationResult

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-calculator.ts" sourceLine="74" packageName="@vendure/core" />

The return value of the <a href='/typescript-api/shipping/shipping-calculator#calculateshippingfn'>CalculateShippingFn</a>.

```ts title="Signature"
interface ShippingCalculationResult {
  price: number;
  priceIncludesTax: boolean;
  taxRate: number;
  metadata?: Record<string, any>;
}
```

### price

<MemberInfo kind="property" type="number"   />

The shipping price without any taxes.
### priceIncludesTax

<MemberInfo kind="property" type="boolean"   />

Whether or not the given price already includes taxes.
### taxRate

<MemberInfo kind="property" type="number"   />

The tax rate applied to the shipping price.
### metadata

<MemberInfo kind="property" type="Record&#60;string, any&#62;"   />

Arbitrary metadata may be returned from the calculation function. This can be used
e.g. to return data on estimated delivery times or any other data which may be
needed in the storefront application when listing eligible shipping methods.


## CalculateShippingFn

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-calculator.ts" sourceLine="114" packageName="@vendure/core" />

A function which implements the specific shipping calculation logic. It takes an <a href='/typescript-api/entities/order#order'>Order</a> and
an arguments object and should return the shipping price as an integer in cents.

Should return a <a href='/typescript-api/shipping/shipping-calculator#shippingcalculationresult'>ShippingCalculationResult</a> object.

```ts title="Signature"
type CalculateShippingFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: ShippingMethod
) => CalculateShippingFnResult
```
