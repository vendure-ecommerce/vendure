---
title: "Asset"
weight: 10
date: 2023-07-14T16:57:49.833Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Asset
<div class="symbol">


# Asset

{{< generation-info sourceFile="packages/core/src/entity/asset/asset.entity.ts" sourceLine="19" packageName="@vendure/core">}}

An Asset represents a file such as an image which can be associated with certain other entities
such as Products.

## Signature

```TypeScript
class Asset extends VendureEntity implements Taggable, ChannelAware, HasCustomFields {
  constructor(input?: DeepPartial<Asset>)
  @Column() @Column() name: string;
  @Column('varchar') @Column('varchar') type: AssetType;
  @Column() @Column() mimeType: string;
  @Column({ default: 0 }) @Column({ default: 0 }) width: number;
  @Column({ default: 0 }) @Column({ default: 0 }) height: number;
  @Column() @Column() fileSize: number;
  @Column() @Column() source: string;
  @Column() @Column() preview: string;
  @Column('simple-json', { nullable: true }) @Column('simple-json', { nullable: true })
    focalPoint?: { x: number; y: number };
  @ManyToMany(type => Tag) @JoinTable() @ManyToMany(type => Tag)
    @JoinTable()
    tags: Tag[];
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
  @Column(type => CustomAssetFields) @Column(type => CustomAssetFields)
    customFields: CustomAssetFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#taggable'>Taggable</a>
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Asset"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="AssetType"  >}}

{{< member-description >}}{{< /member-description >}}

### mimeType

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### width

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### height

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### fileSize

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### source

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### preview

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### focalPoint

{{< member-info kind="property" type="{ x: number; y: number }"  >}}

{{< member-description >}}{{< /member-description >}}

### tags

{{< member-info kind="property" type="<a href='/typescript-api/entities/tag#tag'>Tag</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomAssetFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
