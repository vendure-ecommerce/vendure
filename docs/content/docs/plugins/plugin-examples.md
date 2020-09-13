---
title: "Plugin Examples"
weight: 4
showtoc: true
---
 
# Plugin Examples 

Here are some simplified examples of plugins which serve to illustrate what can be done with Vendure plugins. *Note: implementation details are skipped in these examples for the sake of brevity. A complete example with explanation can be found in [Writing A Vendure Plugin]({{< relref "writing-a-vendure-plugin" >}}).*

{{< alert "primary" >}}
  For a complete working example of a Vendure plugin, see the [real-world-vendure Reviews plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/reviews)
{{< /alert >}}

## Modifying the VendureConfig

This example shows how to modify the VendureConfig, in this case by adding a custom field to allow product ratings.
```TypeScript
// my-plugin.ts
import { VendurePlugin } from '@vendure/core';

@VendurePlugin({
  configuration: config => {
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

## Defining a new database entity

This example shows how new TypeORM database entities can be defined by plugins.

```TypeScript
// product-review.entity.ts
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

@Entity()
class ProductReview extends VendureEntity {
  constructor(input?: DeepPartial<ProductReview>) {
    super(input);
  }

  @Column()
  text: string;
  
  @Column()
  rating: number;
}
```
```TypeScript
// reviews-plugin.ts
import { VendurePlugin } from '@vendure/core';
import { ProductReview } from './product-review.entity';

@VendurePlugin({
  entites: [ProductReview],
})
export class ReviewsPlugin {}
```

## Extending the GraphQL API

This example adds a new query to the GraphQL Admin API. It also demonstrates how [Nest's dependency injection](https://docs.nestjs.com/providers) can be used to encapsulate and inject services within the plugin module.
 
```TypeScript
// top-sellers.resolver.ts
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core'

@Resolver()
class TopSellersResolver {

  constructor(private topSellersService: TopSellersService) {}

  @Query()
  topSellers(@Ctx() ctx: RequestContext, @Args() args: any) {
    return this.topSellersService.getTopSellers(ctx, args.from, args.to);
  }

}
```
{{< alert "primary" >}}
  **Note:** The `@Ctx` decorator gives you access to [the `RequestContext`]({{< relref "request-context" >}}), which is an object containing useful information about the current request - active user, current channel etc.
{{< /alert >}}
```TypeScript
// top-sellers.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
class TopSellersService { 
  getTopSellers() { /* ... */ }
}
```

```TypeScript
// top-sellers.plugin.ts
import gql from 'graphql-tag';
import { VendurePlugin } from '@vendure/core';
import { TopSellersService } from './top-sellers.service'
import { TopSellersResolver } from './top-sellers.resolver'

@VendurePlugin({
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
```

Using the `gql` tag, it is possible to:

* add new queries `extend type Query { ... }`
* add new mutations (`extend type Mutation { ... }`)
* define brand new types `type MyNewType { ... }`
* add new fields to built-in types (`extend type Product { newField: String }`)

## Adding a REST endpoint

This plugin adds a single REST endpoint at `http://localhost:3000/products` which returns a list of all Products. Find out more about [Nestjs REST Controllers](https://docs.nestjs.com/controllers).
```TypeScript
// products.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Ctx, ProductService, RequestContext } from '@vendure/core'; 

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService) {}

    @Get()
    findAll(@Ctx() ctx: RequestContext) {
        return this.productService.findAll(ctx);
    }
}
```
```TypeScript
// rest.plugin.ts
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductsController } from './products.controller';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [ProductsController],
})
export class RestPlugin {}
```

{{< alert "primary" >}}
  **Note:** [The `PluginCommonModule`]({{< relref "plugin-common-module" >}}) should be imported to gain access to Vendure core providers - in this case it is required in order to be able to inject `ProductService` into our controller.
{{< /alert >}}

Side note: since this uses no Vendure-specific metadata, it could also be written using the Nestjs `@Module()` decorator rather than the `@VendurePlugin()` decorator.

## Running processes on the Worker

This example shows how to set up a microservice running on the Worker process, as well as subscribing to events via the [EventBus]({{< relref "event-bus" >}}).

Also see the docs for [WorkerService]({{< relref "worker-service" >}}).

```TypeScript
// order-processing.controller.ts
import { asyncObservable, ID, Order } from '@vendure/core';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProcessOrderMessage } from './process-order-message';

@Controller()
class OrderProcessingController {

  constructor(@InjectConnection() private connection: Connection) {}

  @MessagePattern(ProcessOrderMessage.pattern)
  async processOrder({ orderId }: ProcessOrderMessage['data']) {
    const order = await this.connection.getRepository(Order).findOne(orderId);
    // ...do some expensive / slow computation
    return true;
  }

}
```
* This controller will be executed as a microservice in the [Vendure worker process]({{< relref "vendure-worker" >}}). This makes it suitable for long-running or resource-intensive tasks that you do not want to interfere with the main process which is handling GraphQL API requests.
* Messages are sent to the worker using [WorkerMessages]({{< relref "worker-message" >}}), each of which has a unique pattern and can include a payload of data sent from the main process.
* The return value of the method should correspond to the return type of the WorkerMessage (the second generic argument, `boolean` in the case of `ProcessOrderMessage` - see next snippet)

```TypeScript
// process-order-message.ts
import { ID, WorkerMessage } from '@vendure/core';

export class ProcessOrderMessage extends WorkerMessage<{ orderId: ID }, boolean> {
  static readonly pattern = 'ProcessOrder';
}
```

The `ProcessOrderMessage` is sent in response to certain events:

```TypeScript
import { OnVendureBootstrap, OrderStateTransitionEvent, PluginCommonModule, 
  VendurePlugin, WorkerService, EventBus } from '@vendure/core';
import { OrderProcessingController } from './process-order.controller';
import { ProcessOrderMessage } from './process-order-message';

@VendurePlugin({
  imports: [PluginCommonModule],
  workers: [OrderProcessingController],
})
export class OrderAnalyticsPlugin implements OnVendureBootstrap {

  constructor(
    private workerService: WorkerService,
    private eventBus: EventBus,
  ) {}
  
  /**
   * When the server bootstraps, set up a subscription for events 
   * published whenever  an Order changes state. When an Order has 
   * been fulfilled, we send a message to the controller running on
   * the Worker process to let it process that order.
   */
  onVendureBootstrap() {
    this.eventBus.ofType(OrderStateTransitionEvent).subscribe(event => {
      if (event.toState === 'Delivered') {
        this.workerService.send(new ProcessOrderMessage({ orderId: event.order.id })).subscribe();
      }
    });
  }

}
```

## Using the JobQueueService

If your plugin involves long-running tasks, you can take advantage of the [job queue system]({{< relref "/docs/developer-guide/job-queue" >}}) that comes with Vendure. This example defines a mutation that can be used to transcode and link a video to a Product's customFields.

```TypeScript
// product-video.resolver.ts
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core'
import { ProductVideoService } from './product-video.service';

@Resolver()
class ProductVideoResolver {

  constructor(private productVideoService: ProductVideoService) {}

  @Mutation()
  addVideoToProduct(@Args() args: any) {
    return this.productVideoService.transcodeForProduct(
      args.productId, 
      args.videoUrl,
    );
  }

}
```
The resolver just defines how to handle the new `addVideoToProduct` mutation, delegating the actual work to the `ProductVideoService`:
```TypeScript
// product-video.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { JobQueue, JobQueueService, ID, Product } from '@vendure/core';
import { transcode } from 'third-party-video-sdk'; 

let jobQueue: JobQueue<{ productId: ID; videoUrl: string; }>;

@Injectable()
class ProductVideoService implements OnModuleInit { 
  
  constructor(private jobQueueService: JobQueueService, 
              @InjectConnection() private connection: Connection) {}

  onModuleInit() {
    // This check ensures that only a single JobQueue is created, even if this
    // service gets instantiated more than once.
    if (!jobQueue) {
      jobQueue = this.jobQueueService.createQueue({
        name: 'transcode-video',
        concurrency: 5,
        process: async job => {
          // Here we define how each job in the queue will be processed.
          // In this case we call out to some imaginary 3rd-party video
          // transcoding API, which performs the work and then
          // returns a new URL of the transcoded video, which we can then
          // associate with the Product via the customFields.
          try {
            const result = await transcode(job.data.videoId);
            await this.connection.getRepository(Product).save({
              id: job.data.productId,
              customFields: {
                videoUrl: result.url,
              },
            });
            job.complete(result);
          } catch (e) {
            job.fail(e);
          }
        },
      });
    }
  }

  transcodeForProduct(productId: ID, videoUrl: string) { 
    // Add a new job to the queue and immediately return the
    // job itself.
    return jobQueue.add({ productId, videoUrl });
  }
}
```
The `ProductVideoService` is in charge of setting up the JobQueue and adding jobs to that queue.

```TypeScript
// product-video.plugin.ts
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductVideoService } from './product-video.service'
import { ProductVideoResolver } from './product-video.resolver'

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [ProductVideoService],
  adminApiExtensions: {
    schema: gql`
      extend type Mutation {
        addVideoToProduct(productId: ID! videoUrl: String!): Job!
      }
    `,
    resolvers: [ProductVideoResolver]
  },
  configuration: config => {
    config.customFields.Product.push({
      name: 'videoUrl',
      type: 'string',
    });
    return config;
  }
})
export class ProductVideoPlugin {}
```
Finally, the `ProductVideoPlugin` brings it all together, extending the GraphQL API, defining the required CustomField to store the transcoded video URL, and registering our service and resolver. The [PluginCommonModule]({{< relref "plugin-common-module" >}}) is imported as it exports the JobQueueService.
