---
title: "PollingJobQueueStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PollingJobQueueStrategy

<GenerationInfo sourceFile="packages/core/src/job-queue/polling-job-queue-strategy.ts" sourceLine="242" packageName="@vendure/core" />

This class allows easier implementation of <a href='/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> in a polling style.
Instead of providing <a href='/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> `start()` you should provide a `next` method.

This class should be extended by any strategy which does not support a push-based system
to notify on new jobs. It is used by the <a href='/reference/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a> and <a href='/reference/typescript-api/job-queue/in-memory-job-queue-strategy#inmemoryjobqueuestrategy'>InMemoryJobQueueStrategy</a>.

```ts title="Signature"
class PollingJobQueueStrategy extends InjectableJobQueueStrategy {
    public concurrency: number;
    public pollInterval: number | ((queueName: string) => number);
    public setRetries: (queueName: string, job: Job) => number;
    public backOffStrategy?: BackoffStrategy;
    public gracefulShutdownTimeout: number;
    protected activeQueues = new QueueNameProcessStorage<ActiveQueue<any>>();
    constructor(config?: PollingJobQueueStrategyConfig)
    constructor(concurrency?: number, pollInterval?: number)
    constructor(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number)
    start(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
    stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
    cancelJob(jobId: ID) => Promise<Job | undefined>;
    next(queueName: string) => Promise<Job | undefined>;
    update(job: Job) => Promise<void>;
    findOne(id: ID) => Promise<Job | undefined>;
}
```
* Extends: <code>InjectableJobQueueStrategy</code>



<div className="members-wrapper">

### concurrency

<MemberInfo kind="property" type={`number`}   />


### pollInterval

<MemberInfo kind="property" type={`number | ((queueName: string) =&#62; number)`}   />


### setRetries

<MemberInfo kind="property" type={`(queueName: string, job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>) =&#62; number`}   />


### backOffStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/job-queue/types#backoffstrategy'>BackoffStrategy</a>`}   />


### gracefulShutdownTimeout

<MemberInfo kind="property" type={`number`}   />


### activeQueues

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(config?: PollingJobQueueStrategyConfig) => PollingJobQueueStrategy`}   />


### constructor

<MemberInfo kind="method" type={`(concurrency?: number, pollInterval?: number) => PollingJobQueueStrategy`}   />


### constructor

<MemberInfo kind="method" type={`(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number) => PollingJobQueueStrategy`}   />


### start

<MemberInfo kind="method" type={`(queueName: string, process: (job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => `}   />


### stop

<MemberInfo kind="method" type={`(queueName: string, process: (job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => `}   />


### cancelJob

<MemberInfo kind="method" type={`(jobId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />


### next

<MemberInfo kind="method" type={`(queueName: string) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />

Should return the next job in the given queue. The implementation is
responsible for returning the correct job according to the time of
creation.
### update

<MemberInfo kind="method" type={`(job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>) => Promise&#60;void&#62;`}   />

Update the job details in the store.
### findOne

<MemberInfo kind="method" type={`(id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />

Returns a job by its id.


</div>
