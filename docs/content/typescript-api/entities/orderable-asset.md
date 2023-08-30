---
title: "OrderableAsset"
weight: 10
date: 2023-07-14T16:57:49.839Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderableAsset
<div class="symbol">


# OrderableAsset

{{< generation-info sourceFile="packages/core/src/entity/asset/orderable-asset.entity.ts" sourceLine="18" packageName="@vendure/core">}}

This base class is extended in order to enable specific ordering of the one-to-many
Entity -> Assets relation. Using a many-to-many relation does not provide a way
to guarantee order of the Assets, so this entity is used in place of the
usual join table that would be created by TypeORM.
See https://typeorm.io/#/many-to-many-relations/many-to-many-relations-with-custom-properties

## Signature

```TypeScript
class OrderableAsset extends VendureEntity implements Orderable {
  constructor(input?: DeepPartial<OrderableAsset>)
  @Column() @Column()
    assetId: ID;
  @Index() @ManyToOne(type => Asset, { eager: true, onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Asset, { eager: true, onDelete: 'CASCADE' })
    asset: Asset;
  @Column() @Column()
    position: number;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#orderable'>Orderable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/orderable-asset#orderableasset'>OrderableAsset</a>&#62;) => OrderableAsset"  >}}

{{< member-description >}}{{< /member-description >}}

### assetId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### asset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### position

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
