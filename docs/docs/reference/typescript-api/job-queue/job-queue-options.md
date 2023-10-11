---
title: "JobQueueOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## JobQueueOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="873" packageName="@vendure/core" />

Options related to the built-in job queue.

```ts title="Signature"
interface JobQueueOptions {
    jobQueueStrategy?: JobQueueStrategy;
    jobBufferStorageStrategy?: JobBufferStorageStrategy;
    activeQueues?: string[];
    prefix?: string;
}
```

<div className="members-wrapper">

### jobQueueStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a>`} default="<a href='/reference/typescript-api/job-queue/in-memory-job-queue-strategy#inmemoryjobqueuestrategy'>InMemoryJobQueueStrategy</a>"   />

Defines how the jobs in the queue are persisted and accessed.
### jobBufferStorageStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/job-queue/job-buffer-storage-strategy#jobbufferstoragestrategy'>JobBufferStorageStrategy</a>`}   />


### activeQueues

<MemberInfo kind="property" type={`string[]`}   />

Defines the queues that will run in this process.
This can be used to configure only certain queues to run in this process.
If its empty all queues will be run. Note: this option is primarily intended
to apply to the Worker process. Jobs will _always_ get published to the queue
regardless of this setting, but this setting determines whether they get
_processed_ or not.
### prefix

<MemberInfo kind="property" type={`string`}  since="1.5.0"  />

Prefixes all job queue names with the passed string. This is useful with multiple deployments
in cloud environments using services such as Amazon SQS or Google Cloud Tasks.

For example, we might have a staging and a production deployment in the same account/project and
each one will need its own task queue. We can achieve this with a prefix.


</div>
