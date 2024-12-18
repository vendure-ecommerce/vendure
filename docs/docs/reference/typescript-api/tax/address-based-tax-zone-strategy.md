---
title: "AddressBasedTaxZoneStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AddressBasedTaxZoneStrategy

<GenerationInfo sourceFile="packages/core/src/config/tax/address-based-tax-zone-strategy.ts" sourceLine="39" packageName="@vendure/core" since="3.1.0" />

Address based <a href='/reference/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a> which tries to find the applicable <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> based on the
country of the billing address, or else the country of the shipping address of the Order.

Returns the default <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>'s default tax zone if no applicable zone is found.

:::info

This is configured via `taxOptions.taxZoneStrategy = new AddressBasedTaxZoneStrategy()` in
your VendureConfig.

:::

*Example*

```ts
import { VendureConfig, AddressBasedTaxZoneStrategy } from '@vendure/core';

export const config: VendureConfig = {
  // other options...
  taxOptions: {
    // highlight-next-line
    taxZoneStrategy: new AddressBasedTaxZoneStrategy(),
  },
};
```

```ts title="Signature"
class AddressBasedTaxZoneStrategy implements TaxZoneStrategy {
    determineTaxZone(ctx: RequestContext, zones: Zone[], channel: Channel, order?: Order) => Zone;
}
```
* Implements: <code><a href='/reference/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a></code>



<div className="members-wrapper">

### determineTaxZone

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zones: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>[], channel: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>, order?: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>`}   />




</div>
