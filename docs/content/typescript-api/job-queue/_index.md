---
title: "JobQueue"
weight: 10
date: 2023-07-14T16:57:50.157Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# JobQueue
<div class="symbol">


# JobQueue

{{< generation-info sourceFile="packages/core/src/job-queue/job-queue.ts" sourceLine="25" packageName="@vendure/core">}}

A JobQueue is used to process <a href='/typescript-api/job-queue/job#job'>Job</a>s. A job is added to the queue via the
`.add()` method, and the configured <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> will check for new jobs and process each
according to the defined `process` function.

*Note*: JobQueue instances should not be directly instantiated. Rather, the
<a href='/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a> `createQueue()` method should be used (see that service
for example usage).

## Signature

```TypeScript
class JobQueue<Data extends JobData<Data> = object> {
  name: string
  started: boolean
  constructor(options: CreateQueueOptions<Data>, jobQueueStrategy: JobQueueStrategy, jobBufferService: JobBufferService)
  async add(data: Data, options?: Pick<JobConfig<Data>, 'retries'>) => Promise<SubscribableJob<Data>>;
}
```
## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### started

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(options: <a href='/typescript-api/job-queue/types#createqueueoptions'>CreateQueueOptions</a>&#60;Data&#62;, jobQueueStrategy: <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a>, jobBufferService: JobBufferService) => JobQueue"  >}}

{{< member-description >}}{{< /member-description >}}

### add

{{< member-info kind="method" type="(data: Data, options?: Pick&#60;<a href='/typescript-api/job-queue/types#jobconfig'>JobConfig</a>&#60;Data&#62;, 'retries'&#62;) => Promise&#60;<a href='/typescript-api/job-queue/subscribable-job#subscribablejob'>SubscribableJob</a>&#60;Data&#62;&#62;"  >}}

{{< member-description >}}Adds a new <a href='/typescript-api/job-queue/job#job'>Job</a> to the queue. The resolved <a href='/typescript-api/job-queue/subscribable-job#subscribablejob'>SubscribableJob</a> allows the
calling code to subscribe to updates to the Job:

*Example*

```TypeScript
const job = await this.myQueue.add({ intervalMs, shouldFail }, { retries: 2 });
return job.updates().pipe(
  map(update => {
    // The returned Observable will emit a value for every update to the job
    // such as when the `progress` or `status` value changes.
    Logger.info(`Job ${update.id}: progress: ${update.progress}`);
    if (update.state === JobState.COMPLETED) {
      Logger.info(`COMPLETED ${update.id}: ${update.result}`);
    }
    return update.result;
  }),
  catchError(err => of(err.message)),
);
```

Alternatively, if you aren't interested in the intermediate
`progress` changes, you can convert to a Promise like this:

*Example*

```TypeScript
const job = await this.myQueue.add({ intervalMs, shouldFail }, { retries: 2 });
return job.updates().toPromise()
  .then(update => update.result),
  .catch(err => err.message);
```{{< /member-description >}}


</div>
