---
title: "DefaultJobQueuePlugin"
weight: 10
date: 2023-07-14T16:57:50.193Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultJobQueuePlugin
<div class="symbol">


# DefaultJobQueuePlugin

{{< generation-info sourceFile="packages/core/src/plugin/default-job-queue-plugin/default-job-queue-plugin.ts" sourceLine="171" packageName="@vendure/core">}}

A plugin which configures Vendure to use the SQL database to persist the JobQueue jobs using the <a href='/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a>. If you add this
plugin to an existing Vendure installation, you'll need to run a [database migration](/docs/developer-guide/migrations), since this
plugin will add a new "job_record" table to the database.

*Example*

```TypeScript
import { DefaultJobQueuePlugin, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    DefaultJobQueuePlugin,
  ],
};
```

## Configuration

It is possible to configure the behaviour of the <a href='/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a> by passing options to the static `init()` function:

### pollInterval
The interval in ms between polling for new jobs. The default is 200ms.
Using a longer interval reduces load on the database but results in a slight
delay in processing jobs. For more control, it is possible to supply a function which can specify
a pollInterval based on the queue name:

*Example*

```TypeScript
export const config: VendureConfig = {
  plugins: [
    DefaultJobQueuePlugin.init({
      pollInterval: queueName => {
        if (queueName === 'cart-recovery-email') {
          // This queue does not need to be polled so frequently,
          // so we set a longer interval in order to reduce load
          // on the database.
          return 10000;
        }
        return 200;
      },
    }),
  ],
};
```
### concurrency
The number of jobs to process concurrently per worker. Defaults to 1.

### backoffStrategy
Defines the backoff strategy used when retrying failed jobs. In other words, if a job fails
and is configured to be re-tried, how long should we wait before the next attempt?

By default, a job will be retried as soon as possible, but in some cases this is not desirable. For example,
a job may interact with an unreliable 3rd-party API which is sensitive to too many requests. In this case, an
exponential backoff may be used which progressively increases the delay between each subsequent retry.

*Example*

```TypeScript
export const config: VendureConfig = {
  plugins: [
    DefaultJobQueuePlugin.init({
      pollInterval: 5000,
      concurrency: 2
      backoffStrategy: (queueName, attemptsMade, job) => {
        if (queueName === 'transcode-video') {
          // exponential backoff example
          return (attemptsMade ** 2) * 1000;
        }

        // A default delay for all other queues
        return 1000;
      },
      setRetries: (queueName, job) => {
        if (queueName === 'send-email') {
          // Override the default number of retries
          // for the 'send-email' job because we have
          // a very unreliable email service.
          return 10;
        }
        return job.retries;
      }
    }),
  ],
};
```

## Signature

```TypeScript
class DefaultJobQueuePlugin {
  static init(options: DefaultJobQueueOptions) => Type<DefaultJobQueuePlugin>;
}
```
## Members

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/job-queue/default-job-queue-plugin#defaultjobqueueoptions'>DefaultJobQueueOptions</a>) => Type&#60;<a href='/typescript-api/job-queue/default-job-queue-plugin#defaultjobqueueplugin'>DefaultJobQueuePlugin</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# DefaultJobQueueOptions

{{< generation-info sourceFile="packages/core/src/plugin/default-job-queue-plugin/default-job-queue-plugin.ts" sourceLine="21" packageName="@vendure/core">}}

Configuration options for the DefaultJobQueuePlugin. These values get passed into the
<a href='/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a>.

## Signature

```TypeScript
interface DefaultJobQueueOptions {
  pollInterval?: number | ((queueName: string) => number);
  concurrency?: number;
  backoffStrategy?: BackoffStrategy;
  setRetries?: (queueName: string, job: Job) => number;
  useDatabaseForBuffer?: boolean;
}
```
## Members

### pollInterval

{{< member-info kind="property" type="number | ((queueName: string) =&#62; number)" default="200"  >}}

{{< member-description >}}The interval in ms between polling the database for new jobs. If many job queues
are active, the polling may cause undue load on the database, in which case this value
should be increased to e.g. 1000.{{< /member-description >}}

### concurrency

{{< member-info kind="property" type="number" default="1"  >}}

{{< member-description >}}How many jobs from a given queue to process concurrently.{{< /member-description >}}

### backoffStrategy

{{< member-info kind="property" type="<a href='/typescript-api/job-queue/types#backoffstrategy'>BackoffStrategy</a>" default="() =&#62; 1000"  >}}

{{< member-description >}}The strategy used to decide how long to wait before retrying a failed job.{{< /member-description >}}

### setRetries

{{< member-info kind="property" type="(queueName: string, job: <a href='/typescript-api/job-queue/job#job'>Job</a>) =&#62; number"  >}}

{{< member-description >}}When a job is added to the JobQueue using `JobQueue.add()`, the calling
code may specify the number of retries in case of failure. This option allows
you to override that number and specify your own number of retries based on
the job being added.

*Example*

```TypeScript
setRetries: (queueName, job) => {
  if (queueName === 'send-email') {
    // Override the default number of retries
    // for the 'send-email' job because we have
    // a very unreliable email service.
    return 10;
  }
  return job.retries;
}
 ```{{< /member-description >}}

### useDatabaseForBuffer

{{< member-info kind="property" type="boolean"  since="1.3.0" >}}

{{< member-description >}}If set to `true`, the database will be used to store buffered jobs. This is
recommended for production.

When enabled, a new `JobRecordBuffer` database entity will be defined which will
require a migration when first enabling this option.{{< /member-description >}}


</div>
