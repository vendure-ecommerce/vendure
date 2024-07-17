---
title: "VendureConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VendureConfig

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="1071" packageName="@vendure/core" />

All possible configuration options are defined by the
[`VendureConfig`](https://github.com/vendure-ecommerce/vendure/blob/master/server/src/config/vendure-config.ts) interface.

```ts title="Signature"
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

<div className="members-wrapper">

### apiOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configuration/api-options#apioptions'>ApiOptions</a>`}   />

Configuration for the GraphQL APIs, including hostname, port, CORS settings,
middleware etc.
### assetOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/assets/asset-options#assetoptions'>AssetOptions</a>`}   />

Configuration for the handling of Assets.
### authOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/auth-options#authoptions'>AuthOptions</a>`}   />

Configuration for authorization.
### catalogOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/products-stock/catalog-options#catalogoptions'>CatalogOptions</a>`}   />

Configuration for Products and Collections.
### customFields

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/#customfields'>CustomFields</a>`} default={`{}`}   />

Defines custom fields which can be used to extend the built-in entities.
### dbConnectionOptions

<MemberInfo kind="property" type={`DataSourceOptions`}   />

The connection options used by TypeORM to connect to the database.
See the [TypeORM documentation](https://typeorm.io/#/connection-options) for a
full description of all available options.
### defaultChannelToken

<MemberInfo kind="property" type={`string | null`} default={`null`}   />

The token for the default channel. If not specified, a token
will be randomly generated.
### defaultLanguageCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`} default={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>.en`}   />

The default languageCode of the app.
### entityIdStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;any&#62;`} default={`<a href='/reference/typescript-api/configuration/entity-id-strategy#autoincrementidstrategy'>AutoIncrementIdStrategy</a>`}   />

Defines the strategy used for both storing the primary keys of entities
in the database, and the encoding & decoding of those ids when exposing
entities via the API. The default uses a simple auto-increment integer
strategy.
### entityOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configuration/entity-options#entityoptions'>EntityOptions</a>`}   />


### importExportOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/import-export-options#importexportoptions'>ImportExportOptions</a>`}   />

Configuration settings for data import and export.
### orderOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-options#orderoptions'>OrderOptions</a>`}   />

Configuration settings governing how orders are handled.
### paymentOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-options#paymentoptions'>PaymentOptions</a>`}   />

Configures available payment processing methods.
### plugins

<MemberInfo kind="property" type={`Array&#60;DynamicModule | Type&#60;any&#62;&#62;`} default={`[]`}   />

An array of plugins.
### promotionOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-options#promotionoptions'>PromotionOptions</a>`}   />

Configures the Conditions and Actions available when creating Promotions.
### shippingOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/shipping/shipping-options#shippingoptions'>ShippingOptions</a>`}   />

Configures the available checkers and calculators for ShippingMethods.
### logger

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>`} default={`<a href='/reference/typescript-api/logger/default-logger#defaultlogger'>DefaultLogger</a>`}   />

Provide a logging service which implements the <a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a> interface.
Note that the logging of SQL queries is controlled separately by the
`dbConnectionOptions.logging` property.
### taxOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/tax/tax-options#taxoptions'>TaxOptions</a>`}   />

Configures how taxes are calculated on products.
### jobQueueOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/job-queue/job-queue-options#jobqueueoptions'>JobQueueOptions</a>`}   />

Configures how the job queue is persisted and processed.
### systemOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configuration/system-options#systemoptions'>SystemOptions</a>`}  since="1.6.0"  />

Configures system options


</div>
