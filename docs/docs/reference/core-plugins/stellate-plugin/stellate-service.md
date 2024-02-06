---
title: "StellateService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StellateService

<GenerationInfo sourceFile="packages/stellate-plugin/src/service/stellate.service.ts" sourceLine="23" packageName="@vendure/stellate-plugin" />

The StellateService is used to purge the Stellate cache when certain events occur.

```ts title="Signature"
class StellateService {
    constructor(options: StellatePluginOptions)
    purgeProducts(products: Product[]) => ;
    purgeProductVariants(productVariants: ProductVariant[]) => ;
    purgeSearchResults(items: Array<ProductVariant | Product>) => ;
    purgeAllOfType(type: CachedType) => ;
    purgeCollections(collections: Collection[]) => ;
    purgeSearchResponseCacheIdentifiers(collections: Collection[]) => ;
    purge(type: CachedType, keys?: ID[], keyName:  = 'id') => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/stellate-plugin/stellate-plugin-options#stellatepluginoptions'>StellatePluginOptions</a>) => StellateService`}   />


### purgeProducts

<MemberInfo kind="method" type={`(products: <a href='/reference/typescript-api/entities/product#product'>Product</a>[]) => `}   />

Purges the cache for the given Products.
### purgeProductVariants

<MemberInfo kind="method" type={`(productVariants: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]) => `}   />

Purges the cache for the given ProductVariants.
### purgeSearchResults

<MemberInfo kind="method" type={`(items: Array&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> | <a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;) => `}   />

Purges the cache for SearchResults which contain the given Products or ProductVariants.
### purgeAllOfType

<MemberInfo kind="method" type={`(type: CachedType) => `}   />

Purges the entire cache for the given type.
### purgeCollections

<MemberInfo kind="method" type={`(collections: <a href='/reference/typescript-api/entities/collection#collection'>Collection</a>[]) => `}   />

Purges the cache for the given Collections.
### purgeSearchResponseCacheIdentifiers

<MemberInfo kind="method" type={`(collections: <a href='/reference/typescript-api/entities/collection#collection'>Collection</a>[]) => `}   />

Purges the cache of SearchResults for the given Collections based on slug.
### purge

<MemberInfo kind="method" type={`(type: CachedType, keys?: <a href='/reference/typescript-api/common/id#id'>ID</a>[], keyName:  = 'id') => `}   />

Purges the cache for the given type and keys.


</div>
