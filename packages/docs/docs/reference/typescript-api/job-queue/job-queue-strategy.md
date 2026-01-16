---
title: "JobQueueStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## JobQueueStrategy

<GenerationInfo sourceFile="packages/core/src/config/job-queue/job-queue-strategy.ts" sourceLine="24" packageName="@vendure/core" />

Defines how the jobs in the <a href='/reference/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a> are persisted and
accessed. Custom strategies can be defined to make use of external
services such as Redis.

:::info

This is configured via the `jobQueueOptions.jobQueueStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface JobQueueStrategy extends InjectableStrategy {
    add<Data extends JobData<Data> = object>(job: Job<Data>, jobOptions?: JobQueueStrategyJobOptions<Data>): Promise<Job<Data>>;
    start<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void>;
    stop<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### add

<MemberInfo kind="method" type={`(job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;, jobOptions?: JobQueueStrategyJobOptions&#60;Data&#62;) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;&#62;`}   />

Add a new job to the queue.
### start

<MemberInfo kind="method" type={`(queueName: string, process: (job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;`}   />

Start the job queue
### stop

<MemberInfo kind="method" type={`(queueName: string, process: (job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;`}   />

Stops a queue from running. Its not guaranteed to stop immediately.


</div>
