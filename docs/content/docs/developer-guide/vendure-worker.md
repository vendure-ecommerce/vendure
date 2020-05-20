---
title: "Vendure Worker"
showtoc: true
---

# Vendure Worker
 
The Vendure Worker is a process which is responsible for running computationally intensive or otherwise long-running tasks in the background. For example updating a search index or performing image transformations.

The worker is started by calling the [`bootstrapWorker()`]({{< relref "bootstrap-worker" >}}) function with the same configuration as is passed to the main server `bootstrap()`:

```TypeScript
import { Transport } from '@nestjs/microservices';
import { bootstrapWorker, VendureConfig } from '@vendure/core';

const config: VendureConfig = {
    // ...
    workerOptions: {
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 4242,
        },
    },
};

bootstrapWorker(config).catch(err => {
    console.log(err);
});
```

## Underlying architecture

Internally, the Worker is an instance of a [NestJS microservice](https://docs.nestjs.com/microservices/basics). By default the TCP protocol is used to send messages to and receive reponses from the Worker, but other transports may be used such as Redis or gRPC.

## Running on the main process

There is an option `runInMainProcess` which, if set to `true` will cause the Worker to be bootstrapped along with the main application, without the need for a separate process running `bootstrapWorker`. This is mainly used for testing and development, and is not advised for production use, since it negates the benefits of running long tasks off of the main process.

## Running custom code on the worker

If you are authoring a [Vendure plugin]({{< relref "/docs/plugins" >}}) to implement custom functionality, you can also make use of the worker process in order to handle long-running or computationally-demanding tasks. See the [Plugin Examples]({{< relref "plugin-examples" >}}#running-processes-on-the-worker) page for an example of this.

{{< alert "primary" >}}
Note: The [WorkerService]({{< relref "worker-service" >}}) combines well with the [JobQueueService]({{< relref "job-queue-service" >}}).

A real example of this can be seen in the [EmailPlugin source](https://github.com/vendure-ecommerce/vendure/blob/07e1958f1ad1766e6fd3dae80f526bb688c0288e/packages/email-plugin/src/plugin.ts#L201-L210)
{{< /alert >}}
