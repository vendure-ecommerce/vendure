---
title: "RuntimeVendureConfig"
weight: 10
date: 2023-07-14T16:57:49.781Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# RuntimeVendureConfig
<div class="symbol">


# RuntimeVendureConfig

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="1142" packageName="@vendure/core">}}

This interface represents the VendureConfig object available at run-time, i.e. the user-supplied
config values have been merged with the <a href='/typescript-api/configuration/default-config#defaultconfig'>defaultConfig</a> values.

## Signature

```TypeScript
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
## Extends

 * Required&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;


## Members

### apiOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/configuration/api-options#apioptions'>ApiOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### assetOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/assets/asset-options#assetoptions'>AssetOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### authOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/auth/auth-options#authoptions'>AuthOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### catalogOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/products-stock/catalog-options#catalogoptions'>CatalogOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/custom-fields/#customfields'>CustomFields</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### entityOptions

{{< member-info kind="property" type="Required&#60;Omit&#60;<a href='/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>, 'entityIdStrategy'&#62;&#62; &#38; <a href='/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### importExportOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/import-export/import-export-options#importexportoptions'>ImportExportOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### jobQueueOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/job-queue/job-queue-options#jobqueueoptions'>JobQueueOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### orderOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/orders/order-options#orderoptions'>OrderOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### promotionOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/promotions/promotion-options#promotionoptions'>PromotionOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/shipping/shipping-options#shippingoptions'>ShippingOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### taxOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/tax/tax-options#taxoptions'>TaxOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### systemOptions

{{< member-info kind="property" type="Required&#60;<a href='/typescript-api/configuration/system-options#systemoptions'>SystemOptions</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
