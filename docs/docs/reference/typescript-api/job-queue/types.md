---
title: "Types"
weight: 10
date: 2023-07-14T16:57:50.171Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# types
<div class="symbol">


# BackoffStrategy

{{< generation-info sourceFile="packages/core/src/job-queue/polling-job-queue-strategy.ts" sourceLine="22" packageName="@vendure/core">}}

Defines the backoff strategy used when retrying failed jobs. Returns the delay in
ms that should pass before the failed job is retried.

## Signature

```TypeScript
type BackoffStrategy = (queueName: string, attemptsMade: number, job: Job) => number
```
</div>
<div class="symbol">


# JobUpdate

{{< generation-info sourceFile="packages/core/src/job-queue/subscribable-job.ts" sourceLine="22" packageName="@vendure/core">}}

Job update status as returned from the <a href='/typescript-api/job-queue/subscribable-job#subscribablejob'>SubscribableJob</a>'s `update()` method.

## Signature

```TypeScript
type JobUpdate<T extends JobData<T>> = Pick<
    Job<T>,
    'id' | 'state' | 'progress' | 'result' | 'error' | 'data'
>
```
</div>
<div class="symbol">


# JobUpdateOptions

{{< generation-info sourceFile="packages/core/src/job-queue/subscribable-job.ts" sourceLine="34" packageName="@vendure/core">}}

Job update options, that you can specify by calling {@link SubscribableJob.updates updates()} method.

## Signature

```TypeScript
type JobUpdateOptions = {
  pollInterval?: number;
  timeoutMs?: number;
  errorOnFail?: boolean;
}
```
## Members

### pollInterval

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### timeoutMs

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### errorOnFail

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CreateQueueOptions

{{< generation-info sourceFile="packages/core/src/job-queue/types.ts" sourceLine="13" packageName="@vendure/core">}}

Used to configure a new <a href='/typescript-api/job-queue/#jobqueue'>JobQueue</a> instance.

## Signature

```TypeScript
interface CreateQueueOptions<T extends JobData<T>> {
  name: string;
  process: (job: Job<T>) => Promise<any>;
}
```
## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the queue, e.g. "image processing", "re-indexing" etc.{{< /member-description >}}

### process

{{< member-info kind="property" type="(job: <a href='/typescript-api/job-queue/job#job'>Job</a>&#60;T&#62;) =&#62; Promise&#60;any&#62;"  >}}

{{< member-description >}}Defines the work to be done for each job in the queue. The returned promise
should resolve when the job is complete, or be rejected in case of an error.{{< /member-description >}}


</div>
<div class="symbol">


# JobData

{{< generation-info sourceFile="packages/core/src/job-queue/types.ts" sourceLine="35" packageName="@vendure/core">}}

A JSON-serializable data type which provides a <a href='/typescript-api/job-queue/job#job'>Job</a>with the data it needs to be processed.

## Signature

```TypeScript
type JobData<T> = JsonCompatible<T>
```
</div>
<div class="symbol">


# JobConfig

{{< generation-info sourceFile="packages/core/src/job-queue/types.ts" sourceLine="44" packageName="@vendure/core">}}

Used to instantiate a new <a href='/typescript-api/job-queue/job#job'>Job</a>

## Signature

```TypeScript
interface JobConfig<T extends JobData<T>> {
  queueName: string;
  data: T;
  retries?: number;
  attempts?: number;
  id?: ID;
  state?: JobState;
  progress?: number;
  result?: any;
  error?: any;
  createdAt?: Date;
  startedAt?: Date;
  settledAt?: Date;
}
```
## Members

### queueName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### data

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}{{< /member-description >}}

### retries

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### attempts

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### id

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="<a href='/typescript-api/common/job-state#jobstate'>JobState</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### progress

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### result

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}

### error

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}

### createdAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}

### startedAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}

### settledAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
