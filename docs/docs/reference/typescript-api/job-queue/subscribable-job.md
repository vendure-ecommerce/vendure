---
title: "SubscribableJob"
weight: 10
date: 2023-07-14T16:57:50.188Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SubscribableJob
<div class="symbol">


# SubscribableJob

{{< generation-info sourceFile="packages/core/src/job-queue/subscribable-job.ts" sourceLine="58" packageName="@vendure/core">}}

This is a type of Job object that allows you to subscribe to updates to the Job. It is returned
by the <a href='/typescript-api/job-queue/#jobqueue'>JobQueue</a>'s `add()` method. Note that the subscription capability is only supported
if the <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> implements the <a href='/typescript-api/job-queue/inspectable-job-queue-strategy#inspectablejobqueuestrategy'>InspectableJobQueueStrategy</a> interface (e.g.
the <a href='/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a> does support this).

## Signature

```TypeScript
class SubscribableJob<T extends JobData<T> = any> extends Job<T> {
  constructor(job: Job<T>, jobQueueStrategy: JobQueueStrategy)
  updates(options?: JobUpdateOptions) => Observable<JobUpdate<T>>;
}
```
## Extends

 * <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;T&#62;


## Members

### constructor

{{< member-info kind="method" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;T&#62;, jobQueueStrategy: <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a>) => SubscribableJob"  >}}

{{< member-description >}}{{< /member-description >}}

### updates

{{< member-info kind="method" type="(options?: <a href='/typescript-api/job-queue/types#jobupdateoptions'>JobUpdateOptions</a>) => Observable&#60;<a href='/typescript-api/job-queue/types#jobupdate'>JobUpdate</a>&#60;T&#62;&#62;"  >}}

{{< member-description >}}Returns an Observable stream of updates to the Job. Works by polling the current JobQueueStrategy's `findOne()` method
to obtain updates. If this updates are not subscribed to, then no polling occurs.

Polling interval, timeout and other options may be configured with an options arguments <a href='/typescript-api/job-queue/types#jobupdateoptions'>JobUpdateOptions</a>.{{< /member-description >}}


</div>
