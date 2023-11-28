---
title: "BullMQJobQueuePlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BullMQJobQueuePlugin

<GenerationInfo sourceFile="packages/job-queue-plugin/src/bullmq/plugin.ts" sourceLine="134" packageName="@vendure/job-queue-plugin" />

This plugin is a drop-in replacement of the DefaultJobQueuePlugin, which implements a push-based
job queue strategy built on top of the popular [BullMQ](https://github.com/taskforcesh/bullmq) library.

## Advantages over the DefaultJobQueuePlugin

The advantage of this approach is that jobs are stored in Redis rather than in the database. For more complex
applications with many job queues and/or multiple worker instances, this can massively reduce the load on the
DB server. The reason for this is that the DefaultJobQueuePlugin uses polling to check for new jobs. By default
it will poll every 200ms. A typical Vendure instance uses at least 3 queues (handling emails, collections, search index),
so even with a single worker instance this results in 15 queries per second to the DB constantly. Adding more
custom queues and multiple worker instances can easily result in 50 or 100 queries per second. At this point
performance may be impacted.

Using this plugin, no polling is needed, as BullMQ will _push_ jobs to the worker(s) as and when they are added
to the queue. This results in significantly more scalable performance characteristics, as well as lower latency
in processing jobs.

## Installation

`yarn add @vendure/job-queue-plugin bullmq`

or

`npm install @vendure/job-queue-plugin bullmq`

**Note:** The v1.x version of this plugin is designed to work with bullmq v1.x, etc.

*Example*

```ts
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    // DefaultJobQueuePlugin should be removed from the plugins array
    BullMQJobQueuePlugin.init({
      connection: {
        port: 6379
      }
    }),
  ],
};
```

### Running Redis locally

To develop with this plugin, you'll need an instance of Redis to connect to. Here's a docker-compose config
that will set up [Redis](https://redis.io/) as well as [Redis Commander](https://github.com/joeferner/redis-commander),
which is a web-based UI for interacting with Redis:

```YAML
version: "3"
services:
  redis:
    image: bitnami/redis:6.2
    hostname: redis
    container_name: redis
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
    ports:
      - "6379:6379"
  redis-commander:
    container_name: redis-commander
    hostname: redis-commander
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8085:8081"
```

## Concurrency

The default concurrency of a single worker is 3, i.e. up to 3 jobs will be processed at the same time.
You can change the concurrency in the `workerOptions` passed to the `init()` method:

*Example*

```ts
const config: VendureConfig = {
  plugins: [
    BullMQJobQueuePlugin.init({
      workerOptions: {
        concurrency: 10,
      },
    }),
  ],
};
```

## Removing old jobs

By default, BullMQ will keep completed jobs in the `completed` set and failed jobs in the `failed` set. Over time,
these sets can grow very large. Since Vendure v2.1, the default behaviour is to remove jobs from these sets after
30 days or after a maximum of 5,000 completed or failed jobs.

This can be configured using the `removeOnComplete` and `removeOnFail` options:

*Example*

```ts
const config: VendureConfig = {
  plugins: [
    BullMQJobQueuePlugin.init({
      workerOptions: {
        removeOnComplete: {
          count: 500,
        },
        removeOnFail: {
          age: 60 * 60 * 24 * 7, // 7 days
          count: 1000,
        },
      }
    }),
  ],
};
```

The `count` option specifies the maximum number of jobs to keep in the set, while the `age` option specifies the
maximum age of a job in seconds. If both options are specified, then the jobs kept will be the ones that satisfy
both properties.

```ts title="Signature"
class BullMQJobQueuePlugin {
    static options: BullMQPluginOptions;
    init(options: BullMQPluginOptions) => ;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/job-queue-plugin/bull-mqplugin-options#bullmqpluginoptions'>BullMQPluginOptions</a>`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/job-queue-plugin/bull-mqplugin-options#bullmqpluginoptions'>BullMQPluginOptions</a>) => `}   />

Configures the plugin.


</div>
