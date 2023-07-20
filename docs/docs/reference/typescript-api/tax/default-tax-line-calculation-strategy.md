---
title: "DefaultTaxLineCalculationStrategy"
weight: 10
date: 2023-07-20T13:56:14.783Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultTaxLineCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/tax/default-tax-line-calculation-strategy.ts" sourceLine="12" packageName="@vendure/core" />

The default <a href='/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a> which applies a single TaxLine to the OrderLine
based on the applicable <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>.

```ts title="Signature"
class DefaultTaxLineCalculationStrategy implements TaxLineCalculationStrategy {
  calculate(args: CalculateTaxLinesArgs) => TaxLine[];
}
```
Implements

 * <a href='/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a>



### calculate

<MemberInfo kind="method" type="(args: <a href='/typescript-api/tax/tax-line-calculation-strategy#calculatetaxlinesargs'>CalculateTaxLinesArgs</a>) => TaxLine[]"   />


