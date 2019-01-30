---
title: "VendureConfig"
weight: 0
date: 2019-01-30T10:57:03.886Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# VendureConfig

{{< generation-info source="/server/src/config/vendure-config.ts">}}

All possible configuration options are defined by the[`VendureConfig`](https://github.com/vendure-ecommerce/vendure/blob/master/server/src/config/vendure-config.ts) interface.{{% alert %}}Note on terminology: many of the configuration properties are named "Strategy" - this is because their use follows the[Strategy Pattern](https://en.wikipedia.org/wiki/Strategy_pattern) of software design.{{% /alert %}}

### apiPath

{{< member-info kind="property" type="string" >}}

The path to the GraphQL API.

### assetOptions

{{< member-info kind="property" type="<a href='/docs/api//assets/asset-options/'>AssetOptions</a>" >}}

Configuration for the handling of Assets.

### authOptions

{{< member-info kind="property" type="<a href='/docs/api//auth/auth-options/'>AuthOptions</a>" >}}

Configuration for authorization.

### channelTokenKey

{{< member-info kind="property" type="string" >}}

The name of the property which contains the token of theactive channel. This property can be included either inthe request header or as a query string.

### cors

{{< member-info kind="property" type="boolean | CorsOptions" >}}

Set the CORS handling for the server.

### customFields

{{< member-info kind="property" type="CustomFields" >}}

Defines custom fields which can be used to extend the built-in entities.

### dbConnectionOptions

{{< member-info kind="property" type="ConnectionOptions" >}}

The connection options used by TypeORM to connect to the database.

### defaultChannelToken

{{< member-info kind="property" type="string | null" >}}

The token for the default channel. If not specified, a tokenwill be randomly generated.

### defaultLanguageCode

{{< member-info kind="property" type="LanguageCode" >}}

The default languageCode of the app.

### emailOptions

{{< member-info kind="property" type="<a href='/docs/api//email/email-options/'>EmailOptions</a>&#60;any&#62;" >}}

Configures the handling of transactional emails.

### entityIdStrategy

{{< member-info kind="property" type="<a href='/docs/api///entity-id-strategy/'>EntityIdStrategy</a>&#60;any&#62;" >}}

Defines the strategy used for both storing the primary keys of entitiesin the database, and the encoding & decoding of those ids when exposingentities via the API. The default uses a simple auto-increment integerstrategy.

### hostname

{{< member-info kind="property" type="string" >}}

Set the hostname of the server.

### importExportOptions

{{< member-info kind="property" type="<a href='/docs/api///import-export-options/'>ImportExportOptions</a>" >}}

Configuration settings for data import and export.

### orderMergeOptions

{{< member-info kind="property" type="<a href='/docs/api//orders/order-merge-options/'>OrderMergeOptions</a>" >}}

Define the strategies governing how Orders are merged when an existingCustomer signs in.

### orderProcessOptions

{{< member-info kind="property" type="<a href='/docs/api//orders/order-process-options/'>OrderProcessOptions</a>&#60;any&#62;" >}}

Defines custom states in the order process finite state machine.

### middleware

{{< member-info kind="property" type="Array&#60;{ handler: RequestHandler; route: string }&#62;" >}}

Custom Express middleware for the server.

### paymentOptions

{{< member-info kind="property" type="<a href='/docs/api//payment/payment-options/'>PaymentOptions</a>" >}}

Configures available payment processing methods.

### plugins

{{< member-info kind="property" type="<a href='/docs/api///vendure-plugin/'>VendurePlugin</a>[]" >}}

An array of plugins.

### port

{{< member-info kind="property" type="number" >}}

Which port the Vendure server should listen on.

### promotionOptions

{{< member-info kind="property" type="<a href='/docs/api//promotions/promotion-options/'>PromotionOptions</a>" >}}

Configures the Conditions and Actions available when creating Promotions.

### shippingOptions

{{< member-info kind="property" type="<a href='/docs/api//orders/shipping-options/'>ShippingOptions</a>" >}}

Configures the available checkers and calculators for ShippingMethods.

### silent

{{< member-info kind="property" type="boolean" >}}

When set to true, no application logging will be output to the console.

### taxOptions

{{< member-info kind="property" type="<a href='/docs/api//tax/tax-options/'>TaxOptions</a>" >}}

Configures how taxes are calculated on products.

