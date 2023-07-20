---
title: "DefaultMoneyStrategy"
weight: 10
date: 2023-07-14T16:57:49.538Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultMoneyStrategy
<div class="symbol">


# DefaultMoneyStrategy

{{< generation-info sourceFile="packages/core/src/config/entity/default-money-strategy.ts" sourceLine="15" packageName="@vendure/core" since="2.0.0">}}

A <a href='/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a> that stores monetary values as a `int` type in the database.
The storage configuration and rounding logic replicates the behaviour of Vendure pre-2.0.

## Signature

```TypeScript
class DefaultMoneyStrategy implements MoneyStrategy {
  readonly readonly moneyColumnOptions: ColumnOptions = {
        type: 'int',
    };
  round(value: number, quantity:  = 1) => number;
}
```
## Implements

 * <a href='/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a>


## Members

### moneyColumnOptions

{{< member-info kind="property" type="ColumnOptions"  >}}

{{< member-description >}}{{< /member-description >}}

### round

{{< member-info kind="method" type="(value: number, quantity:  = 1) => number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
