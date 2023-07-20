---
title: "SqlJobQueueStrategy"
weight: 10
date: 2023-07-14T16:57:50.197Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SqlJobQueueStrategy
<div class="symbol">


# SqlJobQueueStrategy

{{< generation-info sourceFile="packages/core/src/plugin/default-job-queue-plugin/sql-job-queue-strategy.ts" sourceLine="22" packageName="@vendure/core">}}

A <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> which uses the configured SQL database to persist jobs in the queue.
This strategy is used by the <a href='/typescript-api/job-queue/default-job-queue-plugin#defaultjobqueueplugin'>DefaultJobQueuePlugin</a>.

## Signature

```TypeScript
class SqlJobQueueStrategy extends PollingJobQueueStrategy implements InspectableJobQueueStrategy {
  init(injector: Injector) => ;
  destroy() => ;
  async add(job: Job<Data>) => Promise<Job<Data>>;
  async next(queueName: string) => Promise<Job | undefined>;
  async update(job: Job<any>) => Promise<void>;
  async findMany(options?: JobListOptions) => Promise<PaginatedList<Job>>;
  async findOne(id: ID) => Promise<Job | undefined>;
  async findManyById(ids: ID[]) => Promise<Job[]>;
  async removeSettledJobs(queueNames: string[] = [], olderThan?: Date) => ;
}
```
## Extends

 * <a href='/typescript-api/job-queue/polling-job-queue-strategy#pollingjobqueuestrategy'>PollingJobQueueStrategy</a>


## Implements

 * <a href='/typescript-api/job-queue/inspectable-job-queue-strategy#inspectablejobqueuestrategy'>InspectableJobQueueStrategy</a>


## Members

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### destroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### add

{{< member-info kind="method" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### next

{{< member-info kind="method" type="(queueName: string) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;any&#62;) => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findMany

{{< member-info kind="method" type="(options?: JobListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findManyById

{{< member-info kind="method" type="(ids: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### removeSettledJobs

{{< member-info kind="method" type="(queueNames: string[] = [], olderThan?: Date) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
