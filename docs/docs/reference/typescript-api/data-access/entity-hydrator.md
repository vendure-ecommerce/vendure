---
title: "EntityHydrator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EntityHydrator

<GenerationInfo sourceFile="packages/core/src/service/helpers/entity-hydrator/entity-hydrator.service.ts" sourceLine="77" packageName="@vendure/core" since="1.3.0" />

This is a helper class which is used to "hydrate" entity instances, which means to populate them
with the specified relations. This is useful when writing plugin code which receives an entity,
and you need to ensure that one or more relations are present.

*Example*

```ts
import { Injectable } from '@nestjs/common';
import { ID, RequestContext, EntityHydrator, ProductVariantService } from '@vendure/core';

@Injectable()
export class MyService {

  constructor(
     // highlight-next-line
     private entityHydrator: EntityHydrator,
     private productVariantService: ProductVariantService,
  ) {}

  myMethod(ctx: RequestContext, variantId: ID) {
    const product = await this.productVariantService
      .getProductForVariant(ctx, variantId);

    // at this stage, we don't know which of the Product relations
    // will be joined at runtime.

    // highlight-start
    await this.entityHydrator
      .hydrate(ctx, product, { relations: ['facetValues.facet' ]});

    // You can be sure now that the `facetValues` & `facetValues.facet` relations are populated
    // highlight-end
  }
}
```

In this above example, the `product` instance will now have the `facetValues` relation
available, and those FacetValues will have their `facet` relations joined too.

This `hydrate` method will _also_ automatically take care or translating any
translatable entities (e.g. Product, Collection, Facet), and if the `applyProductVariantPrices`
options is used (see <a href='/reference/typescript-api/data-access/hydrate-options#hydrateoptions'>HydrateOptions</a>), any related ProductVariant will have the correct
Channel-specific prices applied to them.

Custom field relations may also be hydrated:

*Example*

```ts
const customer = await this.customerService
  .findOne(ctx, id);

await this.entityHydrator
  .hydrate(ctx, customer, { relations: ['customFields.avatar' ]});
```

```ts title="Signature"
class EntityHydrator {
    constructor(connection: TransactionalConnection, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService)
    hydrate(ctx: RequestContext, target: Entity, options: HydrateOptions<Entity>) => Promise<Entity>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, productPriceApplicator: <a href='/reference/typescript-api/service-helpers/product-price-applicator#productpriceapplicator'>ProductPriceApplicator</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => EntityHydrator`}   />


### hydrate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, target: Entity, options: <a href='/reference/typescript-api/data-access/hydrate-options#hydrateoptions'>HydrateOptions</a>&#60;Entity&#62;) => Promise&#60;Entity&#62;`}  since="1.3.0"  />

Hydrates (joins) the specified relations to the target entity instance. This method
mutates the `target` entity.

*Example*

```ts
await this.entityHydrator.hydrate(ctx, product, {
  relations: [
    'variants.stockMovements'
    'optionGroups.options',
    'featuredAsset',
  ],
  applyProductVariantPrices: true,
});
```


</div>
