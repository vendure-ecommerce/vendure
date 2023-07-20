---
title: "DefaultMoneyStrategy"
weight: 10
date: 2023-07-20T13:56:14.421Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultMoneyStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/default-money-strategy.ts" sourceLine="15" packageName="@vendure/core" since="2.0.0" />

A <a href='/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a> that stores monetary values as a `int` type in the database.
The storage configuration and rounding logic replicates the behaviour of Vendure pre-2.0.

```ts title="Signature"
class DefaultMoneyStrategy implements MoneyStrategy {
  readonly readonly moneyColumnOptions: ColumnOptions = {
        type: 'int',
    };
  round(value: number, quantity:  = 1) => number;
}
```
Implements

 * <a href='/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a>



### moneyColumnOptions

<MemberInfo kind="property" type="ColumnOptions"   />


### round

<MemberInfo kind="method" type="(value: number, quantity:  = 1) => number"   />


