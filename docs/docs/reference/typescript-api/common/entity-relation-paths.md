---
title: "EntityRelationPaths"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EntityRelationPaths

<GenerationInfo sourceFile="packages/core/src/common/types/entity-relation-paths.ts" sourceLine="23" packageName="@vendure/core" />

This type allows type-safe access to entity relations using strings with dot notation.
It works to 2 levels deep.

*Example*

```ts
type T1 = EntityRelationPaths<Product>;
```
In the above example, the type `T1` will be a string union of all relations of the
`Product` entity:

 * `'featuredAsset'`
 * `'variants'`
 * `'variants.options'`
 * `'variants.featuredAsset'`
 * etc.

```ts title="Signature"
type EntityRelationPaths<T extends VendureEntity> = | `customFields.${string}`
    | PathsToStringProps1<T>
    | Join<PathsToStringProps2<T>, '.'>
    | TripleDotPath
```
