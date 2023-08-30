---
title: "Country"
weight: 10
date: 2023-07-14T16:57:49.978Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Country
<div class="symbol">


# Country

{{< generation-info sourceFile="packages/core/src/entity/region/country.entity.ts" sourceLine="14" packageName="@vendure/core">}}

A country to which is available when creating / updating an <a href='/typescript-api/entities/address#address'>Address</a>. Countries are
grouped together into <a href='/typescript-api/entities/zone#zone'>Zone</a>s which are in turn used to determine applicable shipping
and taxes for an <a href='/typescript-api/entities/order#order'>Order</a>.

## Signature

```TypeScript
class Country extends Region {
  constructor(input?: DeepPartial<Country>)
  readonly readonly type: RegionType = 'country';
}
```
## Extends

 * <a href='/typescript-api/entities/region#region'>Region</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;) => Country"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="RegionType"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
