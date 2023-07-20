---
title: "EntityHydrator"
weight: 10
date: 2023-07-14T16:57:50.226Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EntityHydrator
<div class="symbol">


# EntityHydrator

{{< generation-info sourceFile="packages/core/src/service/helpers/entity-hydrator/entity-hydrator.service.ts" sourceLine="53" packageName="@vendure/core" since="1.3.0">}}

This is a helper class which is used to "hydrate" entity instances, which means to populate them
with the specified relations. This is useful when writing plugin code which receives an entity
and you need to ensure that one or more relations are present.

*Example*

```TypeScript
const product = await this.productVariantService
  .getProductForVariant(ctx, variantId);

await this.entityHydrator
  .hydrate(ctx, product, { relations: ['facetValues.facet' ]});
```

In this above example, the `product` instance will now have the `facetValues` relation
available, and those FacetValues will have their `facet` relations joined too.

This `hydrate` method will _also_ automatically take care or translating any
translatable entities (e.g. Product, Collection, Facet), and if the `applyProductVariantPrices`
options is used (see <a href='/typescript-api/data-access/hydrate-options#hydrateoptions'>HydrateOptions</a>), any related ProductVariant will have the correct
Channel-specific prices applied to them.

Custom field relations may also be hydrated:

*Example*

```TypeScript
const customer = await this.customerService
  .findOne(ctx, id);

await this.entityHydrator
  .hydrate(ctx, customer, { relations: ['customFields.avatar' ]});
```

## Signature

```TypeScript
class EntityHydrator {
  constructor(connection: TransactionalConnection, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService)
  async hydrate(ctx: RequestContext, target: Entity, options: HydrateOptions<Entity>) => Promise<Entity>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, productPriceApplicator: <a href='/typescript-api/service-helpers/product-price-applicator#productpriceapplicator'>ProductPriceApplicator</a>, translator: TranslatorService) => EntityHydrator"  >}}

{{< member-description >}}{{< /member-description >}}

### hydrate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, target: Entity, options: <a href='/typescript-api/data-access/hydrate-options#hydrateoptions'>HydrateOptions</a>&#60;Entity&#62;) => Promise&#60;Entity&#62;"  since="1.3.0" >}}

{{< member-description >}}Hydrates (joins) the specified relations to the target entity instance. This method
mutates the `target` entity.

*Example*

```TypeScript
await this.entityHydrator.hydrate(ctx, product, {
  relations: [
    'variants.stockMovements'
    'optionGroups.options',
    'featuredAsset',
  ],
  applyProductVariantPrices: true,
});
```{{< /member-description >}}


</div>
