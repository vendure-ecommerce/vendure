---
title: "Configuration"
weight: 1
---

# Configuration

All configuration and customization of Vendure is done via the `VendureConfig` object which gets passed to the `bootstrap` function:

## Example configuration

```TypeScript
bootstrap({
    authOptions: {
        sessionSecret: 'xup1hki5zo',
    },
    port: 3000,
    apiPath: 'api',
    dbConnectionOptions: {
        type: 'mysql',
        database: 'vendure-dev',
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'vendure/import-assets'),
    },
    plugins: [
        new DefaultAssetServerPlugin({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'vendure/assets'),
            port: 4000,
        }),
        new DefaultEmailPlugin({
            templatePath: path.join(__dirname, 'vendure/email/templates'),
            devMode: true,
        }),
        new DefaultSearchPlugin(),
        new AdminUiPlugin({
            port: 3001,
        }),
    ],
}).catch(err => {
    console.log(err);
});
```

## The `VendureConfig` interface

All possible configuration options are defined by the [`VendureConfig`](https://github.com/vendure-ecommerce/vendure/blob/master/server/src/config/vendure-config.ts) interface.

{{% alert %}}
Note on terminology: many of the configuration properties are named "Strategy" - this is because their use follows the [Strategy Pattern](https://en.wikipedia.org/wiki/Strategy_pattern) of software design.
{{% /alert %}}

### apiPath

The path to the GraphQL API.

### assetOptions

Configuration for the handling of Assets (images and other files). See [assetOptions]({{< ref "config-asset-options.md" >}}).

### authOptions

Configuration for authorization and authentication. See [authOptions](/docs/config-auth-options).

### channelTokenKey

The name of the property which contains the token of the active channel. This property can be included either in the request header or as a query string.

### cors

Set the CORS handling for the server. See [the Express cors docs](https://github.com/expressjs/cors#configuration-options)

### customFields

Defines custom fields which can be used to extend the built-in entities. See [customFields](/docs/config-custom-fields).

### dbConnectionOptions

The connection options used by TypeORM to connect to the database. See the [TypeORM connection options docs](http://typeorm.io/#/connection-options).

### defaultChannelToken

The token for the default channel. If not specified, a token will be randomly generated.

### defaultLanguageCode

The default ISO 639-1 language code of the server.

### emailOptions

Configures the handling of transactional emails. See [emailOptions](/docs/config-email-options).

### entityIdStrategy

Defines the strategy used for both storing the primary keys of entities in the database, and the encoding & decoding of those ids when exposing entities via the API. The default uses a simple auto-increment integer strategy.

### hostname

Set the hostname of the server.

### importExportOptions

Configuration settings for data import and export.

### orderMergeOptions

Define the strategies governing how Orders are merged when an existing Customer signs in.

### orderProcessOptions

Defines custom states in the order process finite state machine. See [orderProcessOptions](/docs/config-order-process-options).

### middleware

Defines custom Express middleware to use for incoming API requests.

### paymentOptions

Configures available payment processing methods. See [paymentOptions](/docs/config-payment-options).

### plugins

Configure the active Vendure plugins. See [plugins](/docs/plugins).

### port

Which port the Vendure server should listen on.

### promotionOptions

Configures the Conditions and Actions available when creating Promotions. See [promotionOptions](/docs/config-promotion-options).

### shippingOptions

Configures the available checkers and calculators for ShippingMethods. See [shippingOptions](/docs/config-shipping-options).

### silent

When set to true, no application logging will be output to the console.

### taxOptions

Configures how taxes are calculated on products. See [taxOptions](/docs/config-tax-options).

