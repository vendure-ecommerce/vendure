---
title: "DefaultMoneyStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultMoneyStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/default-money-strategy.ts" sourceLine="15" packageName="@vendure/core" since="2.0.0" />

A <a href='/reference/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a> that stores monetary values as a `int` type in the database.
The storage configuration and rounding logic replicates the behaviour of Vendure pre-2.0.

```ts title="Signature"
class DefaultMoneyStrategy implements MoneyStrategy {
    readonly moneyColumnOptions: ColumnOptions = {
        type: 'int',
    };
    readonly precision: number = 2;
    round(value: number, quantity:  = 1) => number;
}
```
* Implements: <code><a href='/reference/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a></code>



<div className="members-wrapper">

### moneyColumnOptions

<MemberInfo kind="property" type={`ColumnOptions`}   />


### precision

<MemberInfo kind="property" type={`number`}   />


### round

<MemberInfo kind="method" type={`(value: number, quantity:  = 1) => number`}   />




</div>
