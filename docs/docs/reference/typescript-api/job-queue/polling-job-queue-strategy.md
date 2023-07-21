---
title: "PollingJobQueueStrategy"
weight: 10
date: 2023-07-21T07:17:01.424Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PollingJobQueueStrategy

<GenerationInfo sourceFile="packages/core/src/job-queue/polling-job-queue-strategy.ts" sourceLine="192" packageName="@vendure/core" />

This class allows easier implementation of <a href='/docs/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> in a polling style.
Instead of providing <a href='/docs/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> `start()` you should provide a `next` method.

This class should be extended by any strategy which does not support a push-based system
to notify on new jobs. It is used by the <a href='/docs/reference/typescript-api/job-queue/sql-job-queue-strategy#sqljobqueuestrategy'>SqlJobQueueStrategy</a> and <a href='/docs/reference/typescript-api/job-queue/in-memory-job-queue-strategy#inmemoryjobqueuestrategy'>InMemoryJobQueueStrategy</a>.

```ts title="Signature"
class PollingJobQueueStrategy extends InjectableJobQueueStrategy {
  public public concurrency: number;
  public public pollInterval: number | ((queueName: string) => number);
  public public setRetries: (queueName: string, job: Job) => number;
  public public backOffStrategy?: BackoffStrategy;
  constructor(config?: PollingJobQueueStrategyConfig)
  constructor(concurrency?: number, pollInterval?: number)
  constructor(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number)
  async start(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
  async stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
  async cancelJob(jobId: ID) => Promise<Job | undefined>;
  abstract next(queueName: string) => Promise<Job | undefined>;
  abstract update(job: Job) => Promise<void>;
  abstract findOne(id: ID) => Promise<Job | undefined>;
}
```
* Extends: <code>InjectableJobQueueStrategy</code>



<div className="members-wrapper">

### concurrency

<MemberInfo kind="property" type="number"   />


### pollInterval

<MemberInfo kind="property" type="number | ((queueName: string) =&#62; number)"   />


### setRetries

<MemberInfo kind="property" type="(queueName: string, job: <a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a>) =&#62; number"   />


### backOffStrategy

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/job-queue/types#backoffstrategy'>BackoffStrategy</a>"   />


### constructor

<MemberInfo kind="method" type="(config?: PollingJobQueueStrategyConfig) => PollingJobQueueStrategy"   />


### constructor

<MemberInfo kind="method" type="(concurrency?: number, pollInterval?: number) => PollingJobQueueStrategy"   />


### constructor

<MemberInfo kind="method" type="(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number) => PollingJobQueueStrategy"   />


### start

<MemberInfo kind="method" type="(queueName: string, process: (job: <a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => "   />


### stop

<MemberInfo kind="method" type="(queueName: string, process: (job: <a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => "   />


### cancelJob

<MemberInfo kind="method" type="(jobId: <a href='/docs/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"   />


### next

<MemberInfo kind="method" type="(queueName: string) => Promise&#60;<a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"   />

Should return the next job in the given queue. The implementation is
responsible for returning the correct job according to the time of
creation.
### update

<MemberInfo kind="method" type="(job: <a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a>) => Promise&#60;void&#62;"   />

Update the job details in the store.
### findOne

<MemberInfo kind="method" type="(id: <a href='/docs/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/docs/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;"   />

Returns a job by its id.


</div>
