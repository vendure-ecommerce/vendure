---
title: "Using the JobQueueService"
weight: 4
showtoc: true
---

# Using the JobQueueService

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
import { JobQueue, JobQueueService, ID, Product, TransactionalConnection } from '@vendure/core';
import { transcode } from 'third-party-video-sdk'; 

let jobQueue: JobQueue<{ productId: ID; videoUrl: string; }>;

@Injectable()
class ProductVideoService implements OnModuleInit { 
  
  constructor(private jobQueueService: JobQueueService, 
              private connection: TransactionalConnection) {}

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
