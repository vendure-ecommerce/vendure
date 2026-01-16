---
title: "Interfaces"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ChannelAware

<GenerationInfo sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="17" packageName="@vendure/core" />

Entities which can be assigned to Channels should implement this interface.

```ts title="Signature"
interface ChannelAware {
    channels: Channel[];
}
```

<div className="members-wrapper">

### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />




</div>


## SoftDeletable

<GenerationInfo sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="28" packageName="@vendure/core" />

Entities which can be soft deleted should implement this interface.

```ts title="Signature"
interface SoftDeletable {
    deletedAt: Date | null;
}
```

<div className="members-wrapper">

### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />




</div>


## Orderable

<GenerationInfo sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="39" packageName="@vendure/core" />

Entities which can be ordered relative to their siblings in a list.

```ts title="Signature"
interface Orderable {
    position: number;
}
```

<div className="members-wrapper">

### position

<MemberInfo kind="property" type={`number`}   />




</div>


## Taggable

<GenerationInfo sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="50" packageName="@vendure/core" />

Entities which can have Tags applied to them.

```ts title="Signature"
interface Taggable {
    tags: Tag[];
}
```

<div className="members-wrapper">

### tags

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>[]`}   />




</div>


## Translatable

<GenerationInfo sourceFile="packages/core/src/common/types/locale-types.ts" sourceLine="29" packageName="@vendure/core" />

Entities which have localizable string properties should implement this type.

```ts title="Signature"
interface Translatable {
    translations: Array<Translation<VendureEntity>>;
}
```

<div className="members-wrapper">

### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>&#62;&#62;`}   />




</div>
