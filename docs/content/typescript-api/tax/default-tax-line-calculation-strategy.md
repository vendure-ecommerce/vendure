---
title: "DefaultTaxLineCalculationStrategy"
weight: 10
date: 2023-07-14T16:57:49.709Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultTaxLineCalculationStrategy
<div class="symbol">


# DefaultTaxLineCalculationStrategy

{{< generation-info sourceFile="packages/core/src/config/tax/default-tax-line-calculation-strategy.ts" sourceLine="12" packageName="@vendure/core">}}

The default <a href='/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a> which applies a single TaxLine to the OrderLine
based on the applicable <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>.

## Signature

```TypeScript
class DefaultTaxLineCalculationStrategy implements TaxLineCalculationStrategy {
  calculate(args: CalculateTaxLinesArgs) => TaxLine[];
}
```
## Implements

 * <a href='/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a>


## Members

### calculate

{{< member-info kind="method" type="(args: <a href='/typescript-api/tax/tax-line-calculation-strategy#calculatetaxlinesargs'>CalculateTaxLinesArgs</a>) => TaxLine[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
