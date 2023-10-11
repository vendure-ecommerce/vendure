---
title: "Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BackoffStrategy

<GenerationInfo sourceFile="packages/core/src/job-queue/polling-job-queue-strategy.ts" sourceLine="22" packageName="@vendure/core" />

Defines the backoff strategy used when retrying failed jobs. Returns the delay in
ms that should pass before the failed job is retried.

```ts title="Signature"
type BackoffStrategy = (queueName: string, attemptsMade: number, job: Job) => number
```


## JobUpdate

<GenerationInfo sourceFile="packages/core/src/job-queue/subscribable-job.ts" sourceLine="22" packageName="@vendure/core" />

Job update status as returned from the <a href='/reference/typescript-api/job-queue/subscribable-job#subscribablejob'>SubscribableJob</a>'s `update()` method.

```ts title="Signature"
type JobUpdate<T extends JobData<T>> = Pick<
    Job<T>,
    'id' | 'state' | 'progress' | 'result' | 'error' | 'data'
>
```


## JobUpdateOptions

<GenerationInfo sourceFile="packages/core/src/job-queue/subscribable-job.ts" sourceLine="34" packageName="@vendure/core" />

Job update options, that you can specify by calling {@link SubscribableJob.updates updates()} method.

```ts title="Signature"
type JobUpdateOptions = {
    pollInterval?: number;
    timeoutMs?: number;
    errorOnFail?: boolean;
}
```

<div className="members-wrapper">

### pollInterval

<MemberInfo kind="property" type={`number`}   />


### timeoutMs

<MemberInfo kind="property" type={`number`}   />


### errorOnFail

<MemberInfo kind="property" type={`boolean`}   />




</div>


## CreateQueueOptions

<GenerationInfo sourceFile="packages/core/src/job-queue/types.ts" sourceLine="13" packageName="@vendure/core" />

Used to configure a new <a href='/reference/typescript-api/job-queue/#jobqueue'>JobQueue</a> instance.

```ts title="Signature"
interface CreateQueueOptions<T extends JobData<T>> {
    name: string;
    process: (job: Job<T>) => Promise<any>;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />

The name of the queue, e.g. "image processing", "re-indexing" etc.
### process

<MemberInfo kind="property" type={`(job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;T&#62;) =&#62; Promise&#60;any&#62;`}   />

Defines the work to be done for each job in the queue. The returned promise
should resolve when the job is complete, or be rejected in case of an error.


</div>


## JobData

<GenerationInfo sourceFile="packages/core/src/job-queue/types.ts" sourceLine="35" packageName="@vendure/core" />

A JSON-serializable data type which provides a <a href='/reference/typescript-api/job-queue/job#job'>Job</a>
with the data it needs to be processed.

```ts title="Signature"
type JobData<T> = JsonCompatible<T>
```


## JobConfig

<GenerationInfo sourceFile="packages/core/src/job-queue/types.ts" sourceLine="44" packageName="@vendure/core" />

Used to instantiate a new <a href='/reference/typescript-api/job-queue/job#job'>Job</a>

```ts title="Signature"
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

<div className="members-wrapper">

### queueName

<MemberInfo kind="property" type={`string`}   />


### data

<MemberInfo kind="property" type={`T`}   />


### retries

<MemberInfo kind="property" type={`number`}   />


### attempts

<MemberInfo kind="property" type={`number`}   />


### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/job-state#jobstate'>JobState</a>`}   />


### progress

<MemberInfo kind="property" type={`number`}   />


### result

<MemberInfo kind="property" type={`any`}   />


### error

<MemberInfo kind="property" type={`any`}   />


### createdAt

<MemberInfo kind="property" type={`Date`}   />


### startedAt

<MemberInfo kind="property" type={`Date`}   />


### settledAt

<MemberInfo kind="property" type={`Date`}   />




</div>
