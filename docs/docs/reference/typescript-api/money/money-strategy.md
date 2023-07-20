---
title: "MoneyStrategy"
weight: 10
date: 2023-07-14T16:57:49.540Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# MoneyStrategy
<div class="symbol">


# MoneyStrategy

{{< generation-info sourceFile="packages/core/src/config/entity/money-strategy.ts" sourceLine="40" packageName="@vendure/core" since="2.0.0">}}

The MoneyStrategy defines how monetary values are stored and manipulated. The MoneyStrategy
is defined in <a href='/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>:

*Example*

```TypeScript
const config: VendureConfig = {
  entityOptions: {
    moneyStrategy: new MyCustomMoneyStrategy(),
  }
};
```

## Range

The <a href='/typescript-api/money/default-money-strategy#defaultmoneystrategy'>DefaultMoneyStrategy</a> uses an `int` field in the database, which puts an
effective limit of ~21.4 million on any stored value. For certain use cases
(e.g. business sales with very high amounts, or currencies with very large
denominations), this may cause issues. In this case, you can use the
<a href='/typescript-api/money/big-int-money-strategy#bigintmoneystrategy'>BigIntMoneyStrategy</a> which will use the `bigint` type to store monetary values,
giving an effective upper limit of over 9 quadrillion.

## Precision & rounding

Both the `DefaultMoneyStrategy` and `BigIntMoneyStrategy` store monetary values as integers, representing
the price in the minor units of the currency (i.e. _cents_ in USD or _pennies_ in GBP).

In certain use-cases, it may be required that fractions of a cent or penny be supported. In this case,
the solution would be to define a custom MoneyStrategy which uses a non-integer data type for storing
the value in the database, and defines a `round()` implementation which allows decimal places to be kept.

## Signature

```TypeScript
interface MoneyStrategy extends InjectableStrategy {
  readonly moneyColumnOptions: ColumnOptions;
  round(value: number, quantity?: number): number;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### moneyColumnOptions

{{< member-info kind="property" type="ColumnOptions"  >}}

{{< member-description >}}Defines the TypeORM column used to store monetary values.{{< /member-description >}}

### round

{{< member-info kind="method" type="(value: number, quantity?: number) => number"  >}}

{{< member-description >}}Defines the logic used to round monetary values. For instance, the default behavior
in the <a href='/typescript-api/money/default-money-strategy#defaultmoneystrategy'>DefaultMoneyStrategy</a> is to round the value, then multiply.

```TypeScript
return Math.round(value) * quantity;
```

However, it may be desirable to instead round only _after_ the unit amount has been
multiplied. In this case you can define a custom strategy with logic like this:

```TypeScript
return Math.round(value * quantity);
```{{< /member-description >}}


</div>
