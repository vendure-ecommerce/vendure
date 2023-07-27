---
title: "JobQueueStrategy"
weight: 10
date: 2023-07-14T16:57:49.557Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# JobQueueStrategy
<div class="symbol">


# JobQueueStrategy

{{< generation-info sourceFile="packages/core/src/config/job-queue/job-queue-strategy.ts" sourceLine="16" packageName="@vendure/core">}}

Defines how the jobs in the <a href='/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a> are persisted and
accessed. Custom strategies can be defined to make use of external
services such as Redis.

## Signature

```TypeScript
interface JobQueueStrategy extends InjectableStrategy {
  add<Data extends JobData<Data> = object>(job: Job<Data>): Promise<Job<Data>>;
  start<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void>;
  stop<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### add

{{< member-info kind="method" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;&#62;"  >}}

{{< member-description >}}Add a new job to the queue.{{< /member-description >}}

### start

{{< member-info kind="method" type="(queueName: string, process: (job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Start the job queue{{< /member-description >}}

### stop

{{< member-info kind="method" type="(queueName: string, process: (job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Stops a queue from running. Its not guaranteed to stop immediately.{{< /member-description >}}


</div>
