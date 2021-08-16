---
title: "Using the Job Queue"
weight: 4
showtoc: true
---

# Using the Job Queue

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
  addVideoToProduct(@Args() args: { productId: ID; videoUrl: string; }) {
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

@Injectable()
class ProductVideoService implements OnModuleInit { 
    
  private jobQueue: JobQueue<{ productId: ID; videoUrl: string; }>;
  
  constructor(private jobQueueService: JobQueueService,
              private connection: TransactionalConnection) {}

  async onModuleInit() {
    this.jobQueue = await this.jobQueueService.createQueue({
      name: 'transcode-video',
      process: async job => {
        // Here we define how each job in the queue will be processed.
        // In this case we call out to some imaginary 3rd-party video
        // transcoding API, which performs the work and then
        // returns a new URL of the transcoded video, which we can then
        // associate with the Product via the customFields.
        const result = await transcode(job.data.videoUrl);
        await this.connection.getRepository(Product).save({
          id: job.data.productId,
          customFields: {
            videoUrl: result.url,
          },
        });
        // The value returned from the `process` function is stored as the "result"
        // field of the job (for those JobQueueStrategies that support recording of results).
        //  
        // Any error thrown from this function will cause the job to fail.  
        return result
      },
    });
  }

  transcodeForProduct(productId: ID, videoUrl: string) { 
    // Add a new job to the queue and immediately return the
    // job itself.
    return this.jobQueue.add({ productId, videoUrl }, { retries: 2 });
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

## Subscribing to job updates

When creating a new job via `JobQueue.add()`, it is possible to subscribe to updates to that Job (progress and status changes). This allows you, for example, to create resolvers which are able to return the results of a given Job.

In the video transcoding example above, we could modify the `transcodeForProduct()` call to look like this:

```TypeScript
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
class ProductVideoService implements OnModuleInit { 
  // ... omitted
    
  transcodeForProduct(productId: ID, videoUrl: string) { 
    const job = await this.jobQueue.add({ productId, videoUrl }, { retries: 2 });
    
    return job.updates().pipe(
      map(update => {
        // The returned Observable will emit a value for every update to the job
        // such as when the `progress` or `status` value changes.
        Logger.info(`Job ${update.id}: progress: ${update.progress}`);
        if (update.state === JobState.COMPLETED) {
          Logger.info(`COMPLETED ${update.id}: ${update.result}`);
        }
        return update.result;
      }),
      catchError(err => of(err.message)),
    );
  }
}
```

If you prefer to work with Promises rather than Rxjs Observables, you can also convert the updates to a promise:

```TypeScript
const job = await this.jobQueue.add({ productId, videoUrl }, { retries: 2 });
    
return job.updates().toPromise()
  .then(/* ... */)
  .catch(/* ... */);
```
