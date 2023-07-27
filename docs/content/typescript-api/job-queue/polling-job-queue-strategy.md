---
title: "PollingJobQueueStrategy"
weight: 10
date: 2023-07-14T16:57:50.180Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PollingJobQueueStrategy
<div class="symbol">


# PollingJobQueueStrategy

{{< generation-info sourceFile="packages/core/src/job-queue/polling-job-queue-strategy.ts" sourceLine="192" packageName="@vendure/core">}}

This class allows easier implementation of <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> in a polling style.
Instead of providing <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> `start()` you should provide a `next` method.

This class should be extended by any strategy which does not support a push-based system
to notify on new jobs. It is used by the <a href='/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a> and <a href='/typescript-api/job-queue/in-memory-job-queue-strategy#inmemoryjobqueuestrategy'>InMemoryJobQueueStrategy</a>.

## Signature

```TypeScript
class PollingJobQueueStrategy extends InjectableJobQueueStrategy {
  public public concurrency: number;
  public public pollInterval: number | ((queueName: string) => number);
  public public setRetries: (queueName: string, job: Job) => number;
  public public backOffStrategy?: BackoffStrategy;
  constructor(config?: PollingJobQueueStrategyConfig)
  constructor(concurrency?: number, pollInterval?: number)
  constructor(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number)
  async start(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
  async stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
  async cancelJob(jobId: ID) => Promise<Job | undefined>;
  abstract next(queueName: string) => Promise<Job | undefined>;
  abstract update(job: Job) => Promise<void>;
  abstract findOne(id: ID) => Promise<Job | undefined>;
}
```
## Extends

 * InjectableJobQueueStrategy


## Members

### concurrency

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### pollInterval

{{< member-info kind="property" type="number | ((queueName: string) =&#62; number)"  >}}

{{< member-description >}}{{< /member-description >}}

### setRetries

{{< member-info kind="property" type="(queueName: string, job: <a href='/typescript-api/job-queue/job#job'>Job</a>) =&#62; number"  >}}

{{< member-description >}}{{< /member-description >}}

### backOffStrategy

{{< member-info kind="property" type="<a href='/typescript-api/job-queue/types#backoffstrategy'>BackoffStrategy</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(config?: PollingJobQueueStrategyConfig) => PollingJobQueueStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(concurrency?: number, pollInterval?: number) => PollingJobQueueStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number) => PollingJobQueueStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### start

{{< member-info kind="method" type="(queueName: string, process: (job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}

### stop

{{< member-info kind="method" type="(queueName: string, process: (job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}

### cancelJob

{{< member-info kind="method" type="(jobId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### next

{{< member-info kind="method" type="(queueName: string) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}Should return the next job in the given queue. The implementation is
responsible for returning the correct job according to the time of
creation.{{< /member-description >}}

### update

{{< member-info kind="method" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Update the job details in the store.{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}Returns a job by its id.{{< /member-description >}}


</div>
