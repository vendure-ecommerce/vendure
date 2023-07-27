---
title: "VendureConfig"
weight: 10
date: 2023-07-14T16:57:49.771Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# VendureConfig
<div class="symbol">


# VendureConfig

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="1012" packageName="@vendure/core">}}

All possible configuration options are defined by the
[`VendureConfig`](https://github.com/vendure-ecommerce/vendure/blob/master/server/src/config/vendure-config.ts) interface.

## Signature

```TypeScript
interface VendureConfig {
  apiOptions: ApiOptions;
  assetOptions?: AssetOptions;
  authOptions: AuthOptions;
  catalogOptions?: CatalogOptions;
  customFields?: CustomFields;
  dbConnectionOptions: DataSourceOptions;
  defaultChannelToken?: string | null;
  defaultLanguageCode?: LanguageCode;
  entityIdStrategy?: EntityIdStrategy<any>;
  entityOptions?: EntityOptions;
  importExportOptions?: ImportExportOptions;
  orderOptions?: OrderOptions;
  paymentOptions: PaymentOptions;
  plugins?: Array<DynamicModule | Type<any>>;
  promotionOptions?: PromotionOptions;
  shippingOptions?: ShippingOptions;
  logger?: VendureLogger;
  taxOptions?: TaxOptions;
  jobQueueOptions?: JobQueueOptions;
  systemOptions?: SystemOptions;
}
```
## Members

### apiOptions

{{< member-info kind="property" type="<a href='/typescript-api/configuration/api-options#apioptions'>ApiOptions</a>"  >}}

{{< member-description >}}Configuration for the GraphQL APIs, including hostname, port, CORS settings,
middleware etc.{{< /member-description >}}

### assetOptions

{{< member-info kind="property" type="<a href='/typescript-api/assets/asset-options#assetoptions'>AssetOptions</a>"  >}}

{{< member-description >}}Configuration for the handling of Assets.{{< /member-description >}}

### authOptions

{{< member-info kind="property" type="<a href='/typescript-api/auth/auth-options#authoptions'>AuthOptions</a>"  >}}

{{< member-description >}}Configuration for authorization.{{< /member-description >}}

### catalogOptions

{{< member-info kind="property" type="<a href='/typescript-api/products-stock/catalog-options#catalogoptions'>CatalogOptions</a>"  >}}

{{< member-description >}}Configuration for Products and Collections.{{< /member-description >}}

### customFields

{{< member-info kind="property" type="<a href='/typescript-api/custom-fields/#customfields'>CustomFields</a>" default="{}"  >}}

{{< member-description >}}Defines custom fields which can be used to extend the built-in entities.{{< /member-description >}}

### dbConnectionOptions

{{< member-info kind="property" type="DataSourceOptions"  >}}

{{< member-description >}}The connection options used by TypeORM to connect to the database.
See the [TypeORM documentation](https://typeorm.io/#/connection-options) for a
full description of all available options.{{< /member-description >}}

### defaultChannelToken

{{< member-info kind="property" type="string | null" default="null"  >}}

{{< member-description >}}The token for the default channel. If not specified, a token
will be randomly generated.{{< /member-description >}}

### defaultLanguageCode

{{< member-info kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>" default="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>.en"  >}}

{{< member-description >}}The default languageCode of the app.{{< /member-description >}}

### entityIdStrategy

{{< member-info kind="property" type="<a href='/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;any&#62;" default="<a href='/typescript-api/configuration/entity-id-strategy#autoincrementidstrategy'>AutoIncrementIdStrategy</a>"  >}}

{{< member-description >}}Defines the strategy used for both storing the primary keys of entities
in the database, and the encoding & decoding of those ids when exposing
entities via the API. The default uses a simple auto-increment integer
strategy.{{< /member-description >}}

### entityOptions

{{< member-info kind="property" type="<a href='/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### importExportOptions

{{< member-info kind="property" type="<a href='/typescript-api/import-export/import-export-options#importexportoptions'>ImportExportOptions</a>"  >}}

{{< member-description >}}Configuration settings for data import and export.{{< /member-description >}}

### orderOptions

{{< member-info kind="property" type="<a href='/typescript-api/orders/order-options#orderoptions'>OrderOptions</a>"  >}}

{{< member-description >}}Configuration settings governing how orders are handled.{{< /member-description >}}

### paymentOptions

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-options#paymentoptions'>PaymentOptions</a>"  >}}

{{< member-description >}}Configures available payment processing methods.{{< /member-description >}}

### plugins

{{< member-info kind="property" type="Array&#60;DynamicModule | Type&#60;any&#62;&#62;" default="[]"  >}}

{{< member-description >}}An array of plugins.{{< /member-description >}}

### promotionOptions

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-options#promotionoptions'>PromotionOptions</a>"  >}}

{{< member-description >}}Configures the Conditions and Actions available when creating Promotions.{{< /member-description >}}

### shippingOptions

{{< member-info kind="property" type="<a href='/typescript-api/shipping/shipping-options#shippingoptions'>ShippingOptions</a>"  >}}

{{< member-description >}}Configures the available checkers and calculators for ShippingMethods.{{< /member-description >}}

### logger

{{< member-info kind="property" type="<a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>" default="<a href='/typescript-api/logger/default-logger#defaultlogger'>DefaultLogger</a>"  >}}

{{< member-description >}}Provide a logging service which implements the <a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a> interface.
Note that the logging of SQL queries is controlled separately by the
`dbConnectionOptions.logging` property.{{< /member-description >}}

### taxOptions

{{< member-info kind="property" type="<a href='/typescript-api/tax/tax-options#taxoptions'>TaxOptions</a>"  >}}

{{< member-description >}}Configures how taxes are calculated on products.{{< /member-description >}}

### jobQueueOptions

{{< member-info kind="property" type="<a href='/typescript-api/job-queue/job-queue-options#jobqueueoptions'>JobQueueOptions</a>"  >}}

{{< member-description >}}Configures how the job queue is persisted and processed.{{< /member-description >}}

### systemOptions

{{< member-info kind="property" type="<a href='/typescript-api/configuration/system-options#systemoptions'>SystemOptions</a>"  since="1.6.0" >}}

{{< member-description >}}Configures system options{{< /member-description >}}


</div>
