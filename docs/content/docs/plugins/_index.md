---
title: "Plugins"
weight: 2
showtoc: true
---
 
# Plugins

Plugins are the method by which the built-in functionality of Vendure can be extended. Plugins in Vendure allow one to:

1. Modify the [VendureConfig]({{< relref "vendure-config" >}}) object.
2. Extend the GraphQL API, including modifying existing types and adding completely new queries and mutations.
3. Define new database entities and interact directly with the database.
4. Run code before the server bootstraps, such as starting webservers.

These abilities make plugins a very versatile and powerful means of implementing custom business requirements.

This section details the official Vendure plugins included in the main Vendure repo, as well as a guide on writing your own plugins for Vendure.

## Plugin Architecture

{{< figure src="plugin_architecture.png" >}}

A plugin in Vendure is a specialized Nestjs Module which is decorated with the [`VendurePlugin` class decorator]({{< relref "vendure-plugin" >}}). This diagram illustrates the how a plugin can integrate with and extend Vendure.
 
1. A Plugin may define logic to be run by the [Vendure Worker]({{< relref "vendure-worker" >}}). This is suitable for long-running or resource-intensive tasks and is done by providing controllers via the [`workers` metadata property]({{< relref "vendure-plugin-metadata" >}}#workers).
2. A Plugin can modify any aspect of server configuration via the [`configuration` metadata property]({{< relref "vendure-plugin-metadata" >}}#configuration).
3. A Plugin can extend the GraphQL APIs via the [`shopApiExtensions` metadata property]({{< relref "vendure-plugin-metadata" >}}#shopapiextensions) and the [`adminApiExtensions` metadata property]({{< relref "vendure-plugin-metadata" >}}#adminapiextensions).
4. A Plugin can interact with Vendure by importing the [`PluginCommonModule`]({{< relref "plugin-common-module" >}}), by which it may inject and of the core Vendure services (which are responsible for all interaction with the database as well as business logic). Additionally a plugin may define new database entities via the [`entities` metadata property]({{< relref "vendure-plugin-metadata" >}}#entities) and otherwise define any other providers and controllers just like any [Nestjs module](https://docs.nestjs.com/modules).
5. A Plugin can run arbitrary code, which allows it to make use of external services. For example, a plugin could interface with a cloud storage provider, a payment gateway, or a video encoding service.

## Plugin Examples

Here are some simplified examples of plugins which serve to illustrate what can be done with Vendure plugins. *Note: implementation details are skipped in these examples for the sake of brevity. A complete example with explanation can be found in [Writing A Vendure Plugin]({{< relref "writing-a-vendure-plugin" >}}).*

### Modifying the VendureConfig

This example shows how to modify the VendureConfig, in this case by adding a custom field to allow product ratings.
```TypeScript
@VendurePlugin({
  configure: config => {
    config.customFields.Product.push({
      name: 'rating',
      type: 'float',
      min: 0,
      max: 5,
    });
    return config;
  },
})
class ProductRatingPlugin {}
```

### Extending the GraphQL API

This example adds a new query to the GraphQL Admin API. It also demonstrates how [Nest's dependency injection](https://docs.nestjs.com/providers) can be used to encapsulate and inject services within the plugin module.
 
```TypeScript
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [TopSellersService],
  adminApiExtensions: {
    schema: gql`
      extend type Query {
        topSellers(from: DateTime! to: DateTime!): [Product!]!
      }
    `,
    resolvers: [TopSellersResolver]
  }
})
export class TopSellersPlugin {}

@Resolver()
class TopSellersResolver {

  constructor(private topSellersService: TopSellersService) {}

  @Query()
  topSellers(@Ctx() ctx: RequestContext, @Args() args: any) {
    return this.topSellersService.getTopSellers(ctx, args.from, args.to);
  }

}

@Injectable()
class TopSellersService { 
  getTopSellers() { /* ... */ }
}
```

### Adding a REST endpoint

This plugin adds a single REST endpoint at `<host:port>/products` which returns a list of all Products. Since this uses no Vendure-specific metadata, it could also be written using the Nestjs `@Module()` decorator rather than the `@VendurePlugin()` decorator.

```TypeScript
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [ProductsController],
})
export class RestPlugin {}

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService) {}

    @Get()
    findAll(@Ctx() ctx: RequestContext) {
        return this.productService.findAll(ctx);
    }
}
```

### Running processes on the Worker

This example shows how to set up a microservice running on the Worker process, as well as subcribing to events via the EventBus.

```TypeScript
@VendurePlugin({
  imports: [PluginCommonModule],
  workers: [OrderProcessingController],
})
export class OrderAnalyticsPlugin implements OnVendureBootstrap {

  constructor(
    @Inject(VENDURE_WORKER_CLIENT) private client: ClientProxy,
    private eventBus: EventBus,
  ) {}
  
  /**
   * When the server bootstraps, set up a subscription for events 
   * published whenever  an Order changes state. When an Order has 
   * been fulfilled, we send a message to the controller running on
   * the Worker process to let it process that order.
   */
  onVendureBootstrap() {
    this.eventBus.subscribe(OrderStateTransitionEvent, event => {
      if (event.toState === 'Fulfilled') {
        this.client.send('ORDER_PLACED', event.order).subscribe();
      }
    });
  }

}

/**
 * This controller will run on the Worker process.
 */
@Controller()
class OrderProcessingController {

  @MessagePattern('ORDER_PLACED')
  async processOrder(order) {
    // Do some expensive computation
  }

}
```
