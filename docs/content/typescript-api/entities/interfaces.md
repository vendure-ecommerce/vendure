---
title: "Interfaces"
weight: 10
date: 2023-07-14T16:57:49.451Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# interfaces
<div class="symbol">


# ChannelAware

{{< generation-info sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="17" packageName="@vendure/core">}}

Entities which can be assigned to Channels should implement this interface.

## Signature

```TypeScript
interface ChannelAware {
  channels: Channel[];
}
```
## Members

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SoftDeletable

{{< generation-info sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="28" packageName="@vendure/core">}}

Entities which can be soft deleted should implement this interface.

## Signature

```TypeScript
interface SoftDeletable {
  deletedAt: Date | null;
}
```
## Members

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Orderable

{{< generation-info sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="39" packageName="@vendure/core">}}

Entities which can be ordered relative to their siblings in a list.

## Signature

```TypeScript
interface Orderable {
  position: number;
}
```
## Members

### position

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Taggable

{{< generation-info sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="50" packageName="@vendure/core">}}

Entities which can have Tags applied to them.

## Signature

```TypeScript
interface Taggable {
  tags: Tag[];
}
```
## Members

### tags

{{< member-info kind="property" type="<a href='/typescript-api/entities/tag#tag'>Tag</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Translatable

{{< generation-info sourceFile="packages/core/src/common/types/locale-types.ts" sourceLine="29" packageName="@vendure/core">}}

Entities which have localizable string properties should implement this type.

## Signature

```TypeScript
interface Translatable {
  translations: Array<Translation<VendureEntity>>;
}
```
## Members

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
