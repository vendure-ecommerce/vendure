---
title: "BullMQJobQueueStrategy"
weight: 10
date: 2023-07-14T16:57:50.778Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BullMQJobQueueStrategy
<div class="symbol">


# BullMQJobQueueStrategy

{{< generation-info sourceFile="packages/job-queue-plugin/src/bullmq/bullmq-job-queue-strategy.ts" sourceLine="31" packageName="@vendure/job-queue-plugin">}}

This JobQueueStrategy uses [BullMQ](https://docs.bullmq.io/) to implement a push-based job queue
on top of Redis. It should not be used alone, but as part of the <a href='/typescript-api/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a>.

## Signature

```TypeScript
class BullMQJobQueueStrategy implements InspectableJobQueueStrategy {
  async init(injector: Injector) => Promise<void>;
  async destroy() => ;
  async add(job: Job<Data>) => Promise<Job<Data>>;
  async cancelJob(jobId: string) => Promise<Job | undefined>;
  async findMany(options?: JobListOptions) => Promise<PaginatedList<Job>>;
  async findManyById(ids: ID[]) => Promise<Job[]>;
  async findOne(id: ID) => Promise<Job | undefined>;
  async removeSettledJobs(queueNames?: string[], olderThan?: Date) => Promise<number>;
  async start(queueName: string, process: (job: Job<Data>) => Promise<any>) => Promise<void>;
  async stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => Promise<void>;
}
```
## Implements

 * <a href='/typescript-api/job-queue/inspectable-job-queue-strategy#inspectablejobqueuestrategy'>InspectableJobQueueStrategy</a>


## Members

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### destroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### add

{{< member-info kind="method" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### cancelJob

{{< member-info kind="method" type="(jobId: string) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findMany

{{< member-info kind="method" type="(options?: JobListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findManyById

{{< member-info kind="method" type="(ids: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### removeSettledJobs

{{< member-info kind="method" type="(queueNames?: string[], olderThan?: Date) => Promise&#60;number&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### start

{{< member-info kind="method" type="(queueName: string, process: (job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### stop

{{< member-info kind="method" type="(queueName: string, process: (job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
