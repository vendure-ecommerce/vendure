---
title: "SqlJobQueueStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SqlJobQueueStrategy

<GenerationInfo sourceFile="packages/core/src/plugin/default-job-queue-plugin/sql-job-queue-strategy.ts" sourceLine="22" packageName="@vendure/core" />

A <a href='/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a> which uses the configured SQL database to persist jobs in the queue.
This strategy is used by the <a href='/reference/typescript-api/job-queue/default-job-queue-plugin#defaultjobqueueplugin'>DefaultJobQueuePlugin</a>.

```ts title="Signature"
class SqlJobQueueStrategy extends PollingJobQueueStrategy implements InspectableJobQueueStrategy {
    init(injector: Injector) => ;
    destroy() => ;
    add(job: Job<Data>, jobOptions?: JobQueueStrategyJobOptions<Data>) => Promise<Job<Data>>;
    next(queueName: string) => Promise<Job | undefined>;
    update(job: Job<any>) => Promise<void>;
    findMany(options?: JobListOptions) => Promise<PaginatedList<Job>>;
    findOne(id: ID) => Promise<Job | undefined>;
    findManyById(ids: ID[]) => Promise<Job[]>;
    removeSettledJobs(queueNames: string[] = [], olderThan?: Date) => ;
}
```
* Extends: <code><a href='/reference/typescript-api/job-queue/polling-job-queue-strategy#pollingjobqueuestrategy'>PollingJobQueueStrategy</a></code>


* Implements: <code><a href='/reference/typescript-api/job-queue/inspectable-job-queue-strategy#inspectablejobqueuestrategy'>InspectableJobQueueStrategy</a></code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### add

<MemberInfo kind="method" type={`(job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;, jobOptions?: JobQueueStrategyJobOptions&#60;Data&#62;) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;&#62;`}   />


### next

<MemberInfo kind="method" type={`(queueName: string) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />


### update

<MemberInfo kind="method" type={`(job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;any&#62;) => Promise&#60;void&#62;`}   />


### findMany

<MemberInfo kind="method" type={`(options?: JobListOptions) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />


### findManyById

<MemberInfo kind="method" type={`(ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>[]&#62;`}   />


### removeSettledJobs

<MemberInfo kind="method" type={`(queueNames: string[] = [], olderThan?: Date) => `}   />




</div>
