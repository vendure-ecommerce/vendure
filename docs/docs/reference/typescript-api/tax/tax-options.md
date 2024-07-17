---
title: "TaxOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="866" packageName="@vendure/core" />



```ts title="Signature"
interface TaxOptions {
    taxZoneStrategy?: TaxZoneStrategy;
    taxLineCalculationStrategy?: TaxLineCalculationStrategy;
}
```

<div className="members-wrapper">

### taxZoneStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a>`} default={`<a href='/reference/typescript-api/tax/default-tax-zone-strategy#defaulttaxzonestrategy'>DefaultTaxZoneStrategy</a>`}   />

Defines the strategy used to determine the applicable Zone used in tax calculations.
### taxLineCalculationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/tax/tax-line-calculation-strategy#taxlinecalculationstrategy'>TaxLineCalculationStrategy</a>`} default={`<a href='/reference/typescript-api/tax/default-tax-line-calculation-strategy#defaulttaxlinecalculationstrategy'>DefaultTaxLineCalculationStrategy</a>`}   />

Defines the strategy used to calculate the TaxLines added to OrderItems.


</div>
