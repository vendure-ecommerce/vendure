---
title: "Province"
weight: 10
date: 2023-07-14T16:57:49.980Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Province
<div class="symbol">


# Province

{{< generation-info sourceFile="packages/core/src/entity/region/province.entity.ts" sourceLine="13" packageName="@vendure/core">}}

A Province represents an administrative subdivision of a <a href='/typescript-api/entities/country#country'>Country</a>. For example, in the
United States, the country would be "United States" and the province would be "California".

## Signature

```TypeScript
class Province extends Region {
  constructor(input?: DeepPartial<Province>)
  readonly readonly type: RegionType = 'province';
}
```
## Extends

 * <a href='/typescript-api/entities/region#region'>Region</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62;) => Province"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="RegionType"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
