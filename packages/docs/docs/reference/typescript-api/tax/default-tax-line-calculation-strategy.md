---
title: "DefaultTaxLineCalculationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultTaxLineCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/tax/default-tax-line-calculation-strategy.ts" sourceLine="12" packageName="@vendure/core" />

The default <a href='/reference/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a> which applies a single TaxLine to the OrderLine
based on the applicable <a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>.

```ts title="Signature"
class DefaultTaxLineCalculationStrategy implements TaxLineCalculationStrategy {
    calculate(args: CalculateTaxLinesArgs) => TaxLine[];
}
```
* Implements: <code><a href='/reference/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a></code>



<div className="members-wrapper">

### calculate

<MemberInfo kind="method" type={`(args: <a href='/reference/typescript-api/tax/tax-line-calculation-strategy#calculatetaxlinesargs'>CalculateTaxLinesArgs</a>) => TaxLine[]`}   />




</div>
