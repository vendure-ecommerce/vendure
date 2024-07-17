---
title: "RuntimeVendureConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RuntimeVendureConfig

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="1201" packageName="@vendure/core" />

This interface represents the VendureConfig object available at run-time, i.e. the user-supplied
config values have been merged with the <a href='/reference/typescript-api/configuration/default-config#defaultconfig'>defaultConfig</a> values.

```ts title="Signature"
interface RuntimeVendureConfig extends Required<VendureConfig> {
    apiOptions: Required<ApiOptions>;
    assetOptions: Required<AssetOptions>;
    authOptions: Required<AuthOptions>;
    catalogOptions: Required<CatalogOptions>;
    customFields: Required<CustomFields>;
    entityOptions: Required<Omit<EntityOptions, 'entityIdStrategy'>> & EntityOptions;
    importExportOptions: Required<ImportExportOptions>;
    jobQueueOptions: Required<JobQueueOptions>;
    orderOptions: Required<OrderOptions>;
    promotionOptions: Required<PromotionOptions>;
    shippingOptions: Required<ShippingOptions>;
    taxOptions: Required<TaxOptions>;
    systemOptions: Required<SystemOptions>;
}
```
* Extends: <code>Required&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;</code>



<div className="members-wrapper">

### apiOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/configuration/api-options#apioptions'>ApiOptions</a>&#62;`}   />


### assetOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/assets/asset-options#assetoptions'>AssetOptions</a>&#62;`}   />


### authOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/auth/auth-options#authoptions'>AuthOptions</a>&#62;`}   />


### catalogOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/products-stock/catalog-options#catalogoptions'>CatalogOptions</a>&#62;`}   />


### customFields

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/custom-fields/#customfields'>CustomFields</a>&#62;`}   />


### entityOptions

<MemberInfo kind="property" type={`Required&#60;Omit&#60;<a href='/reference/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>, 'entityIdStrategy'&#62;&#62; &#38; <a href='/reference/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>`}   />


### importExportOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/import-export/import-export-options#importexportoptions'>ImportExportOptions</a>&#62;`}   />


### jobQueueOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/job-queue/job-queue-options#jobqueueoptions'>JobQueueOptions</a>&#62;`}   />


### orderOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/orders/order-options#orderoptions'>OrderOptions</a>&#62;`}   />


### promotionOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/promotions/promotion-options#promotionoptions'>PromotionOptions</a>&#62;`}   />


### shippingOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/shipping/shipping-options#shippingoptions'>ShippingOptions</a>&#62;`}   />


### taxOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/tax/tax-options#taxoptions'>TaxOptions</a>&#62;`}   />


### systemOptions

<MemberInfo kind="property" type={`Required&#60;<a href='/reference/typescript-api/configuration/system-options#systemoptions'>SystemOptions</a>&#62;`}   />




</div>
