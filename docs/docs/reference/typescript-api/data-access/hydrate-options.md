---
title: "HydrateOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HydrateOptions

<GenerationInfo sourceFile="packages/core/src/service/helpers/entity-hydrator/entity-hydrator-types.ts" sourceLine="12" packageName="@vendure/core" since="1.3.0" />

Options used to control which relations of the entity get hydrated
when using the <a href='/reference/typescript-api/data-access/entity-hydrator#entityhydrator'>EntityHydrator</a> helper.

```ts title="Signature"
interface HydrateOptions<Entity extends VendureEntity> {
    relations: Array<EntityRelationPaths<Entity>>;
    applyProductVariantPrices?: boolean;
}
```

<div className="members-wrapper">

### relations

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/common/entity-relation-paths#entityrelationpaths'>EntityRelationPaths</a>&#60;Entity&#62;&#62;`}   />

Defines the relations to hydrate, using strings with dot notation to indicate
nested joins. If the entity already has a particular relation available, that relation
will be skipped (no extra DB join will be added).
### applyProductVariantPrices

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

If set to `true`, any ProductVariants will also have their `price` and `priceWithTax` fields
applied based on the current context. If prices are not required, this can be left `false` which
will be slightly more efficient.


</div>
