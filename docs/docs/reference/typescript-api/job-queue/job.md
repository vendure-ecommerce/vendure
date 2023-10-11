---
title: "Job"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Job

<GenerationInfo sourceFile="packages/core/src/job-queue/job.ts" sourceLine="37" packageName="@vendure/core" />

A Job represents a piece of work to be run in the background, i.e. outside the request-response cycle.
It is intended to be used for long-running work triggered by API requests. Jobs should now generally
be directly instantiated. Rather, the <a href='/reference/typescript-api/job-queue/#jobqueue'>JobQueue</a> `add()` method should be used to create and
add a new Job to a queue.

```ts title="Signature"
class Job<T extends JobData<T> = any> {
    readonly id: number | string | null;
    readonly queueName: string;
    readonly retries: number;
    readonly createdAt: Date;
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

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`number | string | null`}   />


### queueName

<MemberInfo kind="property" type={`string`}   />


### retries

<MemberInfo kind="property" type={`number`}   />


### createdAt

<MemberInfo kind="property" type={`Date`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### data

<MemberInfo kind="property" type={`T`}   />


### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/job-state#jobstate'>JobState</a>`}   />


### progress

<MemberInfo kind="property" type={`number`}   />


### result

<MemberInfo kind="property" type={`any`}   />


### error

<MemberInfo kind="property" type={`any`}   />


### isSettled

<MemberInfo kind="property" type={`boolean`}   />


### startedAt

<MemberInfo kind="property" type={`Date | undefined`}   />


### settledAt

<MemberInfo kind="property" type={`Date | undefined`}   />


### duration

<MemberInfo kind="property" type={`number`}   />


### attempts

<MemberInfo kind="property" type={`number`}   />


### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/job-queue/types#jobconfig'>JobConfig</a>&#60;T&#62;) => Job`}   />


### start

<MemberInfo kind="method" type={`() => `}   />

Calling this signifies that the job work has started. This method should be
called in the <a href='/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> `next()` method.
### setProgress

<MemberInfo kind="method" type={`(percent: number) => `}   />

Sets the progress (0 - 100) of the job.
### complete

<MemberInfo kind="method" type={`(result?: any) => `}   />

Calling this method signifies that the job succeeded. The result
will be stored in the `Job.result` property.
### fail

<MemberInfo kind="method" type={`(err?: any) => `}   />

Calling this method signifies that the job failed.
### cancel

<MemberInfo kind="method" type={`() => `}   />


### defer

<MemberInfo kind="method" type={`() => `}   />

Sets a RUNNING job back to PENDING. Should be used when the JobQueue is being
destroyed before the job has been completed.
### on

<MemberInfo kind="method" type={`(eventType: <a href='/reference/typescript-api/job-queue/job#jobeventtype'>JobEventType</a>, listener: <a href='/reference/typescript-api/job-queue/job#jobeventlistener'>JobEventListener</a>&#60;T&#62;) => `}   />

Used to register event handlers for job events
### off

<MemberInfo kind="method" type={`(eventType: <a href='/reference/typescript-api/job-queue/job#jobeventtype'>JobEventType</a>, listener: <a href='/reference/typescript-api/job-queue/job#jobeventlistener'>JobEventListener</a>&#60;T&#62;) => `}   />




</div>


## JobEventType

<GenerationInfo sourceFile="packages/core/src/job-queue/job.ts" sourceLine="15" packageName="@vendure/core" />

An event raised by a Job.

```ts title="Signature"
type JobEventType = 'progress'
```


## JobEventListener

<GenerationInfo sourceFile="packages/core/src/job-queue/job.ts" sourceLine="24" packageName="@vendure/core" />

The signature of the event handler expected by the `Job.on()` method.

```ts title="Signature"
type JobEventListener<T extends JobData<T>> = (job: Job<T>) => void
```
