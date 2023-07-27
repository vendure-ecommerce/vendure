---
title: "VendureEntity"
weight: 10
date: 2023-07-14T16:57:49.847Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# VendureEntity
<div class="symbol">


# VendureEntity

{{< generation-info sourceFile="packages/core/src/entity/base/base.entity.ts" sourceLine="13" packageName="@vendure/core">}}

This is the base class from which all entities inherit. The type of
the `id` property is defined by the <a href='/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>.

## Signature

```TypeScript
class VendureEntity {
  constructor(input?: DeepPartial<VendureEntity>)
  @PrimaryGeneratedId() @PrimaryGeneratedId()
    id: ID;
  @CreateDateColumn() @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() @UpdateDateColumn() updatedAt: Date;
}
```
## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>&#62;) => VendureEntity"  >}}

{{< member-description >}}{{< /member-description >}}

### id

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### createdAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}

### updatedAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
