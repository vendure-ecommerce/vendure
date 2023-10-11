---
title: "Breaking API Changes"
sidebar_position: 3
---

# Breaking API Changes

## Breaks from updated dependencies

### TypeScript
- v2 is built on TypeScript **v4.9.5**. You should update your TypeScript version to match this. Doing so is quite likely to reveal new compiler errors (as is usual with TypeScript minor release updates).
- If you are using `ts-node`, update it to the latest version
- If you are targeting `ES2022` or `ESNEXT` in your `tsconfig.json`, you'll need to set `"useDefineForClassFields": false`. See [this issue](https://github.com/vendure-ecommerce/vendure/issues/2099) for more context.

### Apollo Server & GraphQL
If you have any custom ApolloServerPlugins, the plugin methods must now return a Promise. Example:

```diff
export class TranslateErrorsPlugin implements ApolloServerPlugin {
   constructor(private i18nService: I18nService) {}

-  requestDidStart(): GraphQLRequestListener {
+  async requestDidStart(): Promise<GraphQLRequestListener> {
     return {
-      willSendResponse: requestContext => {
+      willSendResponse: async requestContext => {
         const { errors, context } = requestContext;
         if (errors) {
           (requestContext.response as any).errors = errors.map(err => {
             return this.i18nService.translateError(context.req, err as GraphQLError) as any;
           });
         }
       },
     };
   }
}
```

With the update to GraphQL v16, you might run into issues with other packages in the GraphQL ecosystem that also depend on the `graphql` package, such as `graphql-code-generator`. In this case these packages will also need to be updated.

For instance, if you are using the "typescript-compatibility" plugin to generate namespaced types, you'll need to drop this, as it is [no longer maintained](https://the-guild.dev/blog/whats-new-in-graphql-codegen-v2#typescript-compatibility).

### TypeORM
TypeORM 0.3.x introduced a large number of breaking changes. For a complete guide, see the [TypeORM v0.3.0 release notes](https://github.com/typeorm/typeorm/releases/tag/0.3.0). 

Here are the main API changes you'll likely need to make:

- You can no longer compare to `null`, you need to use the new `IsNull()` helper:
    ```diff
    + import { IsNull } from 'typeorm';

    - .find({ where: { deletedAt: null } })
    + .find({ where: { deletedAt: IsNull() } })
    ```
- The `findOne()` method returns `null` rather than `undefined` if a record is not found.
- The `findOne()` method no longer accepts an id argument. Lookup based on id must be done with a `where` clause:
    ```diff
    - .findOne(variantId)
    + .findOne({ where: { id: variantId } })
    ```
- Where clauses must use an entity id rather than passing an entity itself:
    ```diff
    - .find({ where: { user } })
    + .find({ where: { user: { id: user.id } } })
    ```
- The `findByIds()` method has been deprecated. Use the new `In` helper instead:
    ```diff
    + import { In } from 'typeorm';

    - .findByIds(ids)
    + .find({ where: { id: In(ids) } })
    ```

## Vendure TypeScript API Changes

### Custom Order / Fulfillment / Payment processes

In v2, the hard-coded states & transition logic for the Order, Fulfillment and Payment state machines has been extracted from the core services and instead reside in a default `OrderProcess`, `FulfillmentProcess` and `PaymentProcess` object. This allows you to _fully_ customize these flows without having to work around the assumptions & logic implemented by the default processes.

What this means is that if you are defining a custom process, you'll now need to explicitly add the default process to the array.

```diff
+ import { defaultOrderProcess } from '@vendure/core';

orderOptions: {
-  process: [myCustomOrderProcess],
+  process: [defaultOrderProcess, myCustomOrderProcess],
}
```

Also note that `shippingOptions.customFulfillmentProcess` and `paymentOptions.customPaymentProcess` are both now renamed to `process`. The old names are still usable but are deprecated.

### OrderItem no longer exists

As a result of [#1981](https://github.com/vendure-ecommerce/vendure/issues/1981), the `OrderItem` entity no longer exists. The function and data of `OrderItem` is now transferred to `OrderLine`. As a result, the following APIs which previously used OrderItem arguments have now changed:

- `FulfillmentHandler`
- `ChangedPriceHandlingStrategy`
- `PromotionItemAction`
- `TaxLineCalculationStrategy`

If you have implemented any of these APIs, you'll need to check each one, remove the `OrderItem` argument from any methods that are using it,
and update any logic as necessary.

You may also be joining the OrderItem relation in your own TypeORM queries, so you'll need to check for code like this:

```diff
const order = await this.connection
  .getRepository(Order)
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.lines', 'line')
- .leftJoinAndSelect('line.items', 'items')
```

or 

```diff
const order = await this.connection
  .getRepository(Order)
  .findOne(ctx, orderId, {
-    relations: ['lines', 'lines.items'],
+    relations: ['lines'],
  });
```

### ProductVariant stock changes

With [#1545](https://github.com/vendure-ecommerce/vendure/issues/1545) we have changed the way we model stock levels in order to support multiple stock locations. This means that the `ProductVariant.stockOnHand` and `ProductVariant.stockAllocated` properties no longer exist on the `ProductVariant` entity in TypeScript.

Instead, this information is now located at `ProductVariant.stockLevels`, which is an array of [StockLevel]({{< relref "stock-level" >}}) entities.

### New return type for Channel, TaxCategory & Zone lists

- The `ChannelService.findAll()` method now returns a `PaginatedList<Channel>` instead of `Channel[]`. 
- The `channels` GraphQL query now returns a `PaginatedList` rather than a simple array of Channels.
- The `TaxCategoryService.findAll()` method now returns a `PaginatedList<TaxCategory>` instead of `TaxCategory[]`.
- The `taxCategories` GraphQL query now returns a `PaginatedList` rather than a simple array of TaxCategories.
- The `ZoneService.findAll()` method now returns a `PaginatedList<Zone>` instead of `Zone[]`. The old behaviour of `ZoneService.findAll()` (all Zones, cached for rapid access) can now be found under the new `ZoneService.getAllWithMembers()` method.
- The `zones` GraphQL query now returns a `PaginatedList` rather than a simple array of Zones. 

### Admin UI changes

If you are using the `@vendure/ui-devkit` package to generate custom ui extensions, here are the breaking changes to be aware of:

- As part of the major refresh to the Admin UI app, certain layout elements had be changed which can cause your custom routes to look bad. Wrapping all your custom pages in `<vdr-page-block>` (or `<div class="page-block">` if not built with Angular components) will improve things. There will soon be a comprehensive guide published on how to create seamless ui extensions that look just like the built-in screens.
- If you use any of the scoped method of the Admin UI `DataService`, you might find that some no longer exist. They are now deprecated and will eventually be removed. Use the `dataService.query()` and `dataService.mutation()` methods only, passing your own GraphQL documents:
   ```ts
    // Old way
   this.dataService.product.getProducts().single$.subscribe(...);
   ```
   ```ts
    // New way
   const GET_PRODUCTS = gql`
     query GetProducts {
       products {
         items {
           id
           name
           # ... etc
         }
       }
     }
   `;
   this.dataService.query(GET_PRODUCTS).single$.subscribe(...);
   ```
- The Admin UI component `vdr-product-selector` has been renamed to `vdr-product-variant-selector` to more accurately represent what it does. If you are using `vdr-product-selector` if any ui extensions code, update it to use the new selector.

### Other breaking API changes
- **End-to-end tests using Jest** will likely run into issues due to our move towards using some dependencies that make use of ES modules. We have found the best solution to be to migrate tests over to [Vitest](https://vitest.dev), which can handle this and is also significantly faster than Jest. See the updated [Testing guide]({{< relref "/guides/developer-guide/testing" >}}) for instructions on getting started with Vitest.
- Internal `ErrorResult` classes now take a single object argument rather than multiple args.
- All monetary values are now represented in the GraphQL APIs with a new `Money` scalar type. If you use [graphql-code-generator](https://the-guild.dev/graphql/codegen), you'll want to tell it to treat this scalar as a number:
    ```ts
    import { CodegenConfig } from '@graphql-codegen/cli'
 
    const config: CodegenConfig = {
      schema: 'http://localhost:3000/shop-api',
      documents: ['src/**/*graphql.ts'],
      config: {
        scalars: {
          Money: 'number',
        },
      },
      generates: {
        // .. 
      }
    };
    ```
- A new `Region` entity has been introduced, which is a base class for `Country` and the new `Province` entity. The `Zone.members` property is now an array of `Region` rather than `Country`, since Zones may now be composed of both countries and provinces. If you have defined any custom fields on `Country`, you'll need to change it to `Region` in your custom fields config.
- If you are using the **s3 storage strategy** of the AssetServerPlugin, it has been updated to use v3 of the AWS SDKs. This update introduces an [improved modular architecture to the AWS sdk](https://aws.amazon.com/blogs/developer/modular-packages-in-aws-sdk-for-javascript/), resulting in smaller bundle sizes. You need to install the `@aws-sdk/client-s3` & `@aws-sdk/lib-storage` packages, and can remove the `aws-sdk` package. If you are using it in combination with MinIO, you'll also need to rename a config property and provide a region:
   ```diff
   nativeS3Configuration: {
      endpoint: 'http://localhost:9000',
   -  s3ForcePathStyle: true,
   +  forcePathStyle: true,
      signatureVersion: 'v4',
   +  region: 'eu-west-1',
   }
   ```
- The **Stripe plugin** has been made channel aware. This means your api key and webhook secret are now stored in the database, per channel, instead of environment variables.
   To migrate to v2 of the Stripe plugin from @vendure/payments you need to:
  1. Remove the apiKey and webhookSigningSecret from the plugin initialization in vendure-config.ts:
       ```diff
       StripePlugin.init({
       -  apiKey: process.env.YOUR_STRIPE_SECRET_KEY,
       -  webhookSigningSecret: process.env.YOUR_STRIPE_WEBHOOK_SIGNING_SECRET,
          storeCustomersInStripe: true,
       }),
       ```
  2. Start the server and login as administrator. For each channel that you'd like to use Stripe payments, you need to create a payment method with payment handler Stripe payment and the apiKey and webhookSigningSecret belonging to that channel's Stripe account.
- If you are using the **BullMQJobQueuePlugin**, the minimum Redis recommended version is 6.2.0.
- The `WorkerHealthIndicator` which was deprecated in v1.3.0 has been removed, as well as the `jobQueueOptions.enableWorkerHealthCheck` config option.
- The `CustomerGroupEntityEvent` (fired on creation, update or deletion of a CustomerGroup) has been renamed to `CustomerGroupEvent`, and the former `CustomerGroupEvent` (fired when Customers are added to or removed from a group) has been renamed to `CustomerGroupChangeEvent`.
- We introduced the [plugin compatibility API]({{< relref "vendure-plugin-metadata" >}}#compatibility) to allow plugins to indicate what version of Vendure they are compatible with. To avoid bootstrap messages you should add this property to your plugins.
