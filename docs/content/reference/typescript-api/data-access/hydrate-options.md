---
title: "HydrateOptions"
weight: 10
date: 2023-07-14T16:57:50.224Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HydrateOptions
<div class="symbol">


# HydrateOptions

{{< generation-info sourceFile="packages/core/src/service/helpers/entity-hydrator/entity-hydrator-types.ts" sourceLine="12" packageName="@vendure/core" since="1.3.0">}}

Options used to control which relations of the entity get hydrated
when using the <a href='/typescript-api/data-access/entity-hydrator#entityhydrator'>EntityHydrator</a> helper.

## Signature

```TypeScript
interface HydrateOptions<Entity extends VendureEntity> {
  relations: Array<EntityRelationPaths<Entity>>;
  applyProductVariantPrices?: boolean;
}
```
## Members

### relations

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/common/entity-relation-paths#entityrelationpaths'>EntityRelationPaths</a>&#60;Entity&#62;&#62;"  >}}

{{< member-description >}}Defines the relations to hydrate, using strings with dot notation to indicate
nested joins. If the entity already has a particular relation available, that relation
will be skipped (no extra DB join will be added).{{< /member-description >}}

### applyProductVariantPrices

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}If set to `true`, any ProductVariants will also have their `price` and `priceWithTax` fields
applied based on the current context. If prices are not required, this can be left `false` which
will be slightly more efficient.{{< /member-description >}}


</div>
