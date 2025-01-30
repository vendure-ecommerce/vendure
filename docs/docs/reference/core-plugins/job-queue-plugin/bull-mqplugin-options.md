---
title: "BullMQPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BullMQPluginOptions

<GenerationInfo sourceFile="packages/job-queue-plugin/src/bullmq/types.ts" sourceLine="14" packageName="@vendure/job-queue-plugin" since="1.2.0" />

Configuration options for the <a href='/reference/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a>.

```ts title="Signature"
interface BullMQPluginOptions {
    connection?: ConnectionOptions;
    queueOptions?: Omit<QueueOptions, 'connection'>;
    workerOptions?: Omit<WorkerOptions, 'connection'>;
    setRetries?: (queueName: string, job: Job) => number;
    setBackoff?: (queueName: string, job: Job) => BackoffOptions | undefined;
}
```

<div className="members-wrapper">

### connection

<MemberInfo kind="property" type={`ConnectionOptions`}   />

Connection options which will be passed directly to BullMQ when
creating a new Queue, Worker and Scheduler instance.

If omitted, it will attempt to connect to Redis at `127.0.0.1:6379`.
### queueOptions

<MemberInfo kind="property" type={`Omit&#60;QueueOptions, 'connection'&#62;`}   />

Additional options used when instantiating the BullMQ
Queue instance.
See the [BullMQ QueueOptions docs](https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.queueoptions.md)
### workerOptions

<MemberInfo kind="property" type={`Omit&#60;WorkerOptions, 'connection'&#62;`}   />

Additional options used when instantiating the BullMQ
Worker instance.
See the [BullMQ WorkerOptions docs](https://github.com/taskforcesh/bullmq/blob/master/docs/gitbook/api/bullmq.workeroptions.md)
### setRetries

<MemberInfo kind="property" type={`(queueName: string, job: Job) =&#62; number`}  since="1.3.0"  />

When a job is added to the JobQueue using `JobQueue.add()`, the calling
code may specify the number of retries in case of failure. This option allows
you to override that number and specify your own number of retries based on
the job being added.

*Example*

```ts
setRetries: (queueName, job) => {
  if (queueName === 'send-email') {
    // Override the default number of retries
    // for the 'send-email' job because we have
    // a very unreliable email service.
    return 10;
  }
  return job.retries;
}
 ```
### setBackoff

<MemberInfo kind="property" type={`(queueName: string, job: Job) =&#62; <a href='/reference/core-plugins/job-queue-plugin/bull-mqplugin-options#backoffoptions'>BackoffOptions</a> | undefined`} default={`'exponential', 1000`}  since="1.3.0"  />

This allows you to specify the backoff settings when a failed job gets retried.
In other words, this determines how much time should pass before attempting to
process the failed job again. If the function returns `undefined`, the default
value of exponential/1000ms will be used.

*Example*

```ts
setBackoff: (queueName, job) => {
  return {
    type: 'exponential', // or 'fixed'
    delay: 10000 // first retry after 10s, second retry after 20s, 40s,...
  };
}
```


</div>


## BackoffOptions

<GenerationInfo sourceFile="packages/job-queue-plugin/src/bullmq/types.ts" sourceLine="91" packageName="@vendure/job-queue-plugin" since="1.3.0" />

Configuration for the backoff function when retrying failed jobs.

```ts title="Signature"
interface BackoffOptions {
    type: 'exponential' | 'fixed';
    delay: number;
}
```

<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`'exponential' | 'fixed'`}   />


### delay

<MemberInfo kind="property" type={`number`}   />




</div>
