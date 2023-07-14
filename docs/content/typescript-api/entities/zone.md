---
title: "Zone"
weight: 10
date: 2023-07-14T16:57:50.045Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Zone
<div class="symbol">


# Zone

{{< generation-info sourceFile="packages/core/src/entity/zone/zone.entity.ts" sourceLine="17" packageName="@vendure/core">}}

A Zone is a grouping of one or more <a href='/typescript-api/entities/country#country'>Country</a> entities. It is used for
calculating applicable shipping and taxes.

## Signature

```TypeScript
class Zone extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<Zone>)
  @Column() @Column() name: string;
  @ManyToMany(type => Region) @JoinTable() @ManyToMany(type => Region)
    @JoinTable()
    members: Region[];
  @Column(type => CustomZoneFields) @Column(type => CustomZoneFields)
    customFields: CustomZoneFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;) => Zone"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### members

{{< member-info kind="property" type="<a href='/typescript-api/entities/region#region'>Region</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomZoneFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
