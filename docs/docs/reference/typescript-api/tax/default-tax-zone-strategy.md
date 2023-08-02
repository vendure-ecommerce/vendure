---
title: "DefaultTaxZoneStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultTaxZoneStrategy

<GenerationInfo sourceFile="packages/core/src/config/tax/default-tax-zone-strategy.ts" sourceLine="12" packageName="@vendure/core" />

A default method of determining Zone for tax calculations.

```ts title="Signature"
class DefaultTaxZoneStrategy implements TaxZoneStrategy {
    determineTaxZone(ctx: RequestContext, zones: Zone[], channel: Channel, order?: Order) => Zone;
}
```
* Implements: <code><a href='/reference/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a></code>



<div className="members-wrapper">

### determineTaxZone

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zones: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>[], channel: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>, order?: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>`}   />




</div>
