---
title: "InspectableJobQueueStrategy"
weight: 10
date: 2023-07-14T16:57:49.553Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# InspectableJobQueueStrategy
<div class="symbol">


# InspectableJobQueueStrategy

{{< generation-info sourceFile="packages/core/src/config/job-queue/inspectable-job-queue-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

Defines a job queue strategy that can be inspected using the default admin ui

## Signature

```TypeScript
interface InspectableJobQueueStrategy extends JobQueueStrategy {
  findOne(id: ID): Promise<Job | undefined>;
  findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;
  findManyById(ids: ID[]): Promise<Job[]>;
  removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number>;
  cancelJob(jobId: ID): Promise<Job | undefined>;
}
```
## Extends

 * <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a>


## Members

### findOne

{{< member-info kind="method" type="(id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}Returns a job by its id.{{< /member-description >}}

### findMany

{{< member-info kind="method" type="(options?: JobListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#62;&#62;"  >}}

{{< member-description >}}Returns a list of jobs according to the specified options.{{< /member-description >}}

### findManyById

{{< member-info kind="method" type="(ids: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>[]&#62;"  >}}

{{< member-description >}}Returns an array of jobs for the given ids.{{< /member-description >}}

### removeSettledJobs

{{< member-info kind="method" type="(queueNames?: string[], olderThan?: Date) => Promise&#60;number&#62;"  >}}

{{< member-description >}}Remove all settled jobs in the specified queues older than the given date.
If no queueName is passed, all queues will be considered. If no olderThan
date is passed, all jobs older than the current time will be removed.

Returns a promise of the number of jobs removed.{{< /member-description >}}

### cancelJob

{{< member-info kind="method" type="(jobId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
