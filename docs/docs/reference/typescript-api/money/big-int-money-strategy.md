---
title: "BigIntMoneyStrategy"
weight: 10
date: 2023-07-14T16:57:49.537Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BigIntMoneyStrategy
<div class="symbol">


# BigIntMoneyStrategy

{{< generation-info sourceFile="packages/core/src/config/entity/bigint-money-strategy.ts" sourceLine="18" packageName="@vendure/core" since="2.0.0">}}

A <a href='/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a> that stores monetary values as a `bigint` type in the database, which
allows values up to ~9 quadrillion to be stored (limited by JavaScript's `MAX_SAFE_INTEGER` limit).

This strategy also slightly differs in the way rounding is performed, with rounding being done _after_
multiplying the unit price, rather than before (as is the case with the <a href='/typescript-api/money/default-money-strategy#defaultmoneystrategy'>DefaultMoneyStrategy</a>.

## Signature

```TypeScript
class BigIntMoneyStrategy implements MoneyStrategy {
  readonly readonly moneyColumnOptions: ColumnOptions = {
        type: 'bigint',
        transformer: {
            to: (entityValue: number) => {
                return entityValue;
            },
            from: (databaseValue: string): number => {
                if (databaseValue == null) {
                    return databaseValue;
                }
                const intVal = Number.parseInt(databaseValue, 10);
                if (!Number.isSafeInteger(intVal)) {
                    Logger.warn(`Monetary value ${databaseValue} is not a safe integer!`);
                }
                if (Number.isNaN(intVal)) {
                    Logger.warn(`Monetary value ${databaseValue} is not a number!`);
                }
                return intVal;
            },
        },
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
