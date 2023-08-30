---
title: "EntityRelationPaths"
weight: 10
date: 2023-07-14T16:57:49.457Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EntityRelationPaths
<div class="symbol">


# EntityRelationPaths

{{< generation-info sourceFile="packages/core/src/common/types/entity-relation-paths.ts" sourceLine="23" packageName="@vendure/core">}}

This type allows type-safe access to entity relations using strings with dot notation.
It works to 2 levels deep.

*Example*

```TypeScript
type T1 = EntityRelationPaths<Product>;
```
In the above example, the type `T1` will be a string union of all relations of the
`Product` entity:

 * `'featuredAsset'`
 * `'variants'`
 * `'variants.options'`
 * `'variants.featuredAsset'`
 * etc.

## Signature

```TypeScript
type EntityRelationPaths<T extends VendureEntity> = | `customFields.${string}`
    | PathsToStringProps1<T>
    | Join<PathsToStringProps2<T>, '.'>
    | TripleDotPath
```
</div>
