---
title: "Vendure Worker"
showtoc: true
---

# Vendure Worker
 
The Vendure Worker is a process which is responsible for running computationally intensive or otherwise long-running tasks in the background. For example updating a search index or sending emails. Running such tasks in the background allows the server to stay responsive, since a response can be returned immediately without waiting for the slower tasks to complete. 

Put another way, the Worker executes jobs registered with the [JobQueueService]({{< relref "job-queue-service" >}}).

The worker is started by calling the [`bootstrapWorker()`]({{< relref "bootstrap-worker" >}}) function with the same configuration as is passed to the main server `bootstrap()`:

```TypeScript
import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
  // We must explicitly start the job queue in order for this
  // worker instance to start listening for and processing jobs.
  .then(worker => worker.startJobQueue())
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
```

## Underlying architecture

The Worker is a [NestJS standalone application](https://docs.nestjs.com/standalone-applications). This means it is almost identical to the main server app, but does not have any network layer listening for requests. The server communicates with the worker via a "job queue" architecture. The exact implementation of the job queue is dependent on the configured `JobQueueStrategy` - see the [Job Queue guide]({{< relref "job-queue" >}}) for more details.

## Multiple workers

It is possible to run multiple workers in parallel, in order to better handle heavy loads. Using the [JobQueueOptions.activeQueues]({{< relref "job-queue-options" >}}#activequeues) configuration, it is even possible to have particular workers dedicated to one or more specific type of job.
For example, if you application does video transcoding, you might want to set up a dedicated worker just for that task:

```TypeScript
import { bootstrapWorker, mergeConfig } from '@vendure/core';
import { config } from './vendure-config';

const videoWorkerConfig = mergeConfig(config, {
  jobQueueOptions: {
    activeQueues: ['transcode-video'],
  }
})

bootstrapWorker(videoWorkerConfig)
  .then(worker => worker.startJobQueue())
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
```

## Running jobs on the main process

It is possible to run jobs from the Job Queue on the main server. This is mainly used for testing and automated tasks, and is not advised for production use, since it negates the benefits of running long tasks off of the main process. To do so, you need to manually start the JobQueueService:

```TypeScript
import { bootstrap, JobQueueService } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config)
  .then(app => app.get(JobQueueService).start())
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
```

## Running custom code on the worker

If you are authoring a [Vendure plugin]({{< relref "/docs/plugins" >}}) to implement custom functionality, you can also make use of the worker process in order to handle long-running or computationally-demanding tasks. See the [Plugin Examples]({{< relref "plugin-examples" >}}#running-processes-on-the-worker) page for an example of this.

## ProcessContext

Sometimes your code may need to be aware of whether it is being run on the as part of a server or worker process. In this case you can inject the [ProcessContext]({{< relref "process-context" >}}) provider and query it like this:

```TypeScript
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProcessContext } from '@vendure/core';

@Injectable()
export class MyService implements OnApplicationBootstrap {
  constructor(private processContext: ProcessContext) {}

  onApplicationBootstrap() {
    if (this.processContext.isServer) {
      // code which will only execute when running in
      // the server process
    }
  }
}
```
