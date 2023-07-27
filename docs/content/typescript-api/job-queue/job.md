---
title: "Job"
weight: 10
date: 2023-07-14T16:57:50.160Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Job
<div class="symbol">


# Job

{{< generation-info sourceFile="packages/core/src/job-queue/job.ts" sourceLine="37" packageName="@vendure/core">}}

A Job represents a piece of work to be run in the background, i.e. outside the request-response cycle.
It is intended to be used for long-running work triggered by API requests. Jobs should now generally
be directly instantiated. Rather, the <a href='/typescript-api/job-queue/#jobqueue'>JobQueue</a> `add()` method should be used to create and
add a new Job to a queue.

## Signature

```TypeScript
class Job<T extends JobData<T> = any> {
  readonly readonly id: number | string | null;
  readonly readonly queueName: string;
  readonly readonly retries: number;
  readonly readonly createdAt: Date;
  name: string
  data: T
  state: JobState
  progress: number
  result: any
  error: any
  isSettled: boolean
  startedAt: Date | undefined
  settledAt: Date | undefined
  duration: number
  attempts: number
  constructor(config: JobConfig<T>)
  start() => ;
  setProgress(percent: number) => ;
  complete(result?: any) => ;
  fail(err?: any) => ;
  cancel() => ;
  defer() => ;
  on(eventType: JobEventType, listener: JobEventListener<T>) => ;
  off(eventType: JobEventType, listener: JobEventListener<T>) => ;
}
```
## Members

### id

{{< member-info kind="property" type="number | string | null"  >}}

{{< member-description >}}{{< /member-description >}}

### queueName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### retries

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### createdAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### data

{{< member-info kind="property" type="T"  >}}

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

### isSettled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### startedAt

{{< member-info kind="property" type="Date | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### settledAt

{{< member-info kind="property" type="Date | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### duration

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### attempts

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/job-queue/types#jobconfig'>JobConfig</a>&#60;T&#62;) => Job"  >}}

{{< member-description >}}{{< /member-description >}}

### start

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Calling this signifies that the job work has started. This method should be
called in the <a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> `next()` method.{{< /member-description >}}

### setProgress

{{< member-info kind="method" type="(percent: number) => "  >}}

{{< member-description >}}Sets the progress (0 - 100) of the job.{{< /member-description >}}

### complete

{{< member-info kind="method" type="(result?: any) => "  >}}

{{< member-description >}}Calling this method signifies that the job succeeded. The result
will be stored in the `Job.result` property.{{< /member-description >}}

### fail

{{< member-info kind="method" type="(err?: any) => "  >}}

{{< member-description >}}Calling this method signifies that the job failed.{{< /member-description >}}

### cancel

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### defer

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Sets a RUNNING job back to PENDING. Should be used when the JobQueue is being
destroyed before the job has been completed.{{< /member-description >}}

### on

{{< member-info kind="method" type="(eventType: <a href='/typescript-api/job-queue/job#jobeventtype'>JobEventType</a>, listener: <a href='/typescript-api/job-queue/job#jobeventlistener'>JobEventListener</a>&#60;T&#62;) => "  >}}

{{< member-description >}}Used to register event handlers for job events{{< /member-description >}}

### off

{{< member-info kind="method" type="(eventType: <a href='/typescript-api/job-queue/job#jobeventtype'>JobEventType</a>, listener: <a href='/typescript-api/job-queue/job#jobeventlistener'>JobEventListener</a>&#60;T&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# JobEventType

{{< generation-info sourceFile="packages/core/src/job-queue/job.ts" sourceLine="15" packageName="@vendure/core">}}

An event raised by a Job.

## Signature

```TypeScript
type JobEventType = 'progress'
```
</div>
<div class="symbol">


# JobEventListener

{{< generation-info sourceFile="packages/core/src/job-queue/job.ts" sourceLine="24" packageName="@vendure/core">}}

The signature of the event handler expected by the `Job.on()` method.

## Signature

```TypeScript
type JobEventListener<T extends JobData<T>> = (job: Job<T>) => void
```
</div>
