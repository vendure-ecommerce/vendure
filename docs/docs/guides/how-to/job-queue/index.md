---
title: "Run a job on the worker"
---

If your plugin involves long-running tasks, you can take advantage of the [job queue system](/guides/developer-guide/worker-job-queue/). 

Let's say you are building a plugin which allows a video URL to be specified, and then that video gets transcoded into a format suitable for streaming on the storefront. This is a long-running task which should not block the main thread, so we will use the job queue to run the task on the worker.

First we'll add a new mutation to the Admin API schema:

```ts title="src/plugins/product-video/api/api-extensions.ts"
import gql from 'graphql-tag';

export const adminApiExtensions = gql`
  extend type Mutation {
    addVideoToProduct(productId: ID! videoUrl: String!): Job!
  }
`;
```

The resolver looks like this:


```ts title="src/plugins/product-video/api/product-video.resolver.ts"
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, RequestContext, Permission, RequestContext } from '@vendure/core'
import { ProductVideoService } from '../services/product-video.service';

@Resolver()
export class ProductVideoResolver {

    constructor(private productVideoService: ProductVideoService) {}

    @Mutation()
    @Allow(Permission.UpdateProduct)
    addVideoToProduct(@Ctx() ctx: RequestContext, @Args() args: { productId: ID; videoUrl: string; }) {
        return this.productVideoService.transcodeForProduct(
            args.productId,
            args.videoUrl,
        );
    }
}
```
The resolver just defines how to handle the new `addVideoToProduct` mutation, delegating the actual work to the `ProductVideoService`.

## Creating a job queue

The [`JobQueueService`](/reference/typescript-api/job-queue/job-queue-service/) creates and manages job queues. The queue is created when the
application starts up (see [NestJS lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)), and then we can use the `add()` method to add jobs to the queue.

```ts title="src/plugins/product-video/services/product-video.service.ts"
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JobQueue, JobQueueService, ID, Product, TransactionalConnection } from '@vendure/core';
import { transcode } from 'third-party-video-sdk';

@Injectable()
class ProductVideoService implements OnModuleInit {
    
    private jobQueue: JobQueue<{ productId: ID; videoUrl: string; }>;

    constructor(private jobQueueService: JobQueueService,
                private connection: TransactionalConnection) {
    }

    async onModuleInit() {
        this.jobQueue = await this.jobQueueService.createQueue({
            name: 'transcode-video',
            process: async job => {
                // Inside the `process` function we define how each job 
                // in the queue will be processed.
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
                return result;
            },
        });
    }

    transcodeForProduct(productId: ID, videoUrl: string) {
        // Add a new job to the queue and immediately return the
        // job itself.
        return this.jobQueue.add({productId, videoUrl}, {retries: 2});
    }
}
```

Notice the generic type parameter of the `JobQueue`:

```ts
JobQueue<{ productId: ID; videoUrl: string; }>
```

This means that when we call `jobQueue.add()` we must pass in an object of this type. This data will then be available in the `process` function as the `job.data` property.

:::note
The data passed to `jobQueue.add()` must be JSON-serializable, because it gets serialized into a string when stored in the job queue. Therefore you should
avoid passing in complex objects such as `Date` instances, `Buffer`s, etc.
:::

The `ProductVideoService` is in charge of setting up the JobQueue and adding jobs to that queue. Calling 

```ts
productVideoService.transcodeForProduct(id, url);
```

will add a transcoding job to the queue.

:::tip
Plugin code typically gets executed on both the server _and_ the worker. Therefore, you sometimes need to explicitly check
what context you are in. This can be done with the [ProcessContext](/reference/typescript-api/common/process-context/) provider.
:::


Finally, the `ProductVideoPlugin` brings it all together, extending the GraphQL API, defining the required CustomField to store the transcoded video URL, and registering our service and resolver. The [PluginCommonModule](/reference/typescript-api/plugin/plugin-common-module/) is imported as it exports the `JobQueueService`.

```ts title="src/plugins/product-video/product-video.plugin.ts"
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductVideoService } from './services/product-video.service';
import { ProductVideoResolver } from './api/product-video.resolver';
import { adminApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductVideoService],
    adminApiExtensions: {
        schema: adminApiExtensions,
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
## Subscribing to job updates

When creating a new job via `JobQueue.add()`, it is possible to subscribe to updates to that Job (progress and status changes). This allows you, for example, to create resolvers which are able to return the results of a given Job.

In the video transcoding example above, we could modify the `transcodeForProduct()` call to look like this:

```ts title="src/plugins/product-video/services/product-video.service.ts"
import { Injectable, OnModuleInit } from '@nestjs/common';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ID, Product, TransactionalConnection } from '@vendure/core';

@Injectable()
class ProductVideoService implements OnModuleInit {
    // ... omitted (see above)

    transcodeForProduct(productId: ID, videoUrl: string) {
        const job = await this.jobQueue.add({productId, videoUrl}, {retries: 2});

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

```ts
const job = await this.jobQueue.add({ productId, videoUrl }, { retries: 2 });
    
return job.updates().toPromise()
  .then(/* ... */)
  .catch(/* ... */);
```
