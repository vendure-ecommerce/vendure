---
title: "InspectableJobQueueStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InspectableJobQueueStrategy

<GenerationInfo sourceFile="packages/core/src/config/job-queue/inspectable-job-queue-strategy.ts" sourceLine="14" packageName="@vendure/core" />

Defines a job queue strategy that can be inspected using the default admin ui

```ts title="Signature"
interface InspectableJobQueueStrategy extends JobQueueStrategy {
    findOne(id: ID): Promise<Job | undefined>;
    findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;
    findManyById(ids: ID[]): Promise<Job[]>;
    removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number>;
    cancelJob(jobId: ID): Promise<Job | undefined>;
}
```
* Extends: <code><a href='/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a></code>



<div className="members-wrapper">

### findOne

<MemberInfo kind="method" type={`(id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />

Returns a job by its id.
### findMany

<MemberInfo kind="method" type={`(options?: JobListOptions) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#62;&#62;`}   />

Returns a list of jobs according to the specified options.
### findManyById

<MemberInfo kind="method" type={`(ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>[]&#62;`}   />

Returns an array of jobs for the given ids.
### removeSettledJobs

<MemberInfo kind="method" type={`(queueNames?: string[], olderThan?: Date) => Promise&#60;number&#62;`}   />

Remove all settled jobs in the specified queues older than the given date.
If no queueName is passed, all queues will be considered. If no olderThan
date is passed, all jobs older than the current time will be removed.

Returns a promise of the number of jobs removed.
### cancelJob

<MemberInfo kind="method" type={`(jobId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />




</div>
