---
title: "TaxZoneStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxZoneStrategy

<GenerationInfo sourceFile="packages/core/src/config/tax/tax-zone-strategy.ts" sourceLine="28" packageName="@vendure/core" />

Defines how the active <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> is determined for the purposes of calculating taxes.

This strategy is used in 2 scenarios:

1. To determine the applicable Zone when calculating the taxRate to apply when displaying ProductVariants. In this case the
`order` argument will be undefined, as the request is not related to a specific Order.
2. To determine the applicable Zone when calculating the taxRate on the contents of a specific Order. In this case the
`order` argument _will_ be defined, and can be used in the logic. For example, the shipping address can be taken into account.

Note that this method is called very often in a typical user session, so any work it performs should be designed with as little
performance impact as possible.

:::info

This is configured via the `taxOptions.taxZoneStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface TaxZoneStrategy extends InjectableStrategy {
    determineTaxZone(
        ctx: RequestContext,
        zones: Zone[],
        channel: Channel,
        order?: Order,
    ): Zone | Promise<Zone> | undefined;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### determineTaxZone

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zones: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>[], channel: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>, order?: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> | Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62; | undefined`}   />




</div>
