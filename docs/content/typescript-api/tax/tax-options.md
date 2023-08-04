---
title: "TaxOptions"
weight: 10
date: 2023-07-14T16:57:49.765Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxOptions
<div class="symbol">


# TaxOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="825" packageName="@vendure/core">}}



## Signature

```TypeScript
interface TaxOptions {
  taxZoneStrategy?: TaxZoneStrategy;
  taxLineCalculationStrategy?: TaxLineCalculationStrategy;
}
```
## Members

### taxZoneStrategy

{{< member-info kind="property" type="<a href='/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a>" default="<a href='/typescript-api/tax/default-tax-zone-strategy#defaulttaxzonestrategy'>DefaultTaxZoneStrategy</a>"  >}}

{{< member-description >}}Defines the strategy used to determine the applicable Zone used in tax calculations.{{< /member-description >}}

### taxLineCalculationStrategy

{{< member-info kind="property" type="<a href='/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a>" default="<a href='/typescript-api/tax/default-tax-line-calculation-strategy#defaulttaxlinecalculationstrategy'>DefaultTaxLineCalculationStrategy</a>"  >}}

{{< member-description >}}Defines the strategy used to calculate the TaxLines added to OrderItems.{{< /member-description >}}


</div>
