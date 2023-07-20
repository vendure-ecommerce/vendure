---
title: "BullMQPluginOptions"
weight: 10
date: 2023-07-14T16:57:50.787Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BullMQPluginOptions
<div class="symbol">


# BullMQPluginOptions

{{< generation-info sourceFile="packages/job-queue-plugin/src/bullmq/types.ts" sourceLine="14" packageName="@vendure/job-queue-plugin" since="1.2.0">}}

Configuration options for the <a href='/typescript-api/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a>.

## Signature

```TypeScript
interface BullMQPluginOptions {
  connection?: ConnectionOptions;
  queueOptions?: Exclude<QueueOptions, 'connection'>;
  workerOptions?: Exclude<WorkerOptions, 'connection'>;
  setRetries?: (queueName: string, job: Job) => number;
  setBackoff?: (queueName: string, job: Job) => BackoffOptions | undefined;
}
```
## Members

### connection

{{< member-info kind="property" type="ConnectionOptions"  >}}

{{< member-description >}}Connection options which will be passed directly to BullMQ when
creating a new Queue, Worker and Scheduler instance.

If omitted, it will attempt to connect to Redis at `127.0.0.1:6379`.{{< /member-description >}}

### queueOptions

{{< member-info kind="property" type="Exclude&#60;QueueOptions, 'connection'&#62;"  >}}

{{< member-description >}}Additional options used when instantiating the BullMQ
Queue instance.
See the [BullMQ QueueOptions docs](https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.queueoptions.md){{< /member-description >}}

### workerOptions

{{< member-info kind="property" type="Exclude&#60;WorkerOptions, 'connection'&#62;"  >}}

{{< member-description >}}Additional options used when instantiating the BullMQ
Worker instance.
See the [BullMQ WorkerOptions docs](https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.workeroptions.md){{< /member-description >}}

### setRetries

{{< member-info kind="property" type="(queueName: string, job: <a href='/typescript-api/job-queue/job#job'>Job</a>) =&#62; number"  since="1.3.0" >}}

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

### setBackoff

{{< member-info kind="property" type="(queueName: string, job: <a href='/typescript-api/job-queue/job#job'>Job</a>) =&#62; <a href='/typescript-api/core-plugins/job-queue-plugin/bull-mqplugin-options#backoffoptions'>BackoffOptions</a> | undefined" default="'exponential', 1000"  since="1.3.0" >}}

{{< member-description >}}This allows you to specify the backoff settings when a failed job gets retried.
In other words, this determines how much time should pass before attempting to
process the failed job again. If the function returns `undefined`, the default
value of exponential/1000ms will be used.

*Example*

```TypeScript
setBackoff: (queueName, job) => {
  return {
    type: 'exponential', // or 'fixed'
    delay: 10000 // first retry after 10s, second retry after 20s, 40s,...
  };
}
```{{< /member-description >}}


</div>
<div class="symbol">


# BackoffOptions

{{< generation-info sourceFile="packages/job-queue-plugin/src/bullmq/types.ts" sourceLine="91" packageName="@vendure/job-queue-plugin" since="1.3.0">}}

Configuration for the backoff function when retrying failed jobs.

## Signature

```TypeScript
interface BackoffOptions {
  type: 'exponential' | 'fixed';
  delay: number;
}
```
## Members

### type

{{< member-info kind="property" type="'exponential' | 'fixed'"  >}}

{{< member-description >}}{{< /member-description >}}

### delay

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
