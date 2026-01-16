---
title: "InMemoryJobBufferStorageStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InMemoryJobBufferStorageStrategy

<GenerationInfo sourceFile="packages/core/src/job-queue/job-buffer/in-memory-job-buffer-storage-strategy.ts" sourceLine="17" packageName="@vendure/core" since="1.3.0" />

A <a href='/reference/typescript-api/job-queue/job-buffer-storage-strategy#jobbufferstoragestrategy'>JobBufferStorageStrategy</a> which keeps the buffered jobs in memory. Should
_not_ be used in production, since it will lose data in the event of the server
stopping.

Instead, use the <a href='/reference/typescript-api/job-queue/default-job-queue-plugin#defaultjobqueueplugin'>DefaultJobQueuePlugin</a> with the `useDatabaseForBuffer: true` option set,
or the <a href='/reference/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a> or another custom strategy with persistent storage.

```ts title="Signature"
class InMemoryJobBufferStorageStrategy implements JobBufferStorageStrategy {
    protected bufferStorage = new Map<string, Set<Job>>();
    add(bufferId: string, job: Job) => Promise<Job>;
    bufferSize(bufferIds?: string[]) => Promise<{ [bufferId: string]: number }>;
    flush(bufferIds?: string[]) => Promise<{ [bufferId: string]: Job[] }>;
}
```
* Implements: <code><a href='/reference/typescript-api/job-queue/job-buffer-storage-strategy#jobbufferstoragestrategy'>JobBufferStorageStrategy</a></code>



<div className="members-wrapper">

### bufferStorage

<MemberInfo kind="property" type={``}   />


### add

<MemberInfo kind="method" type={`(bufferId: string, job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#62;`}   />


### bufferSize

<MemberInfo kind="method" type={`(bufferIds?: string[]) => Promise&#60;{ [bufferId: string]: number }&#62;`}   />


### flush

<MemberInfo kind="method" type={`(bufferIds?: string[]) => Promise&#60;{ [bufferId: string]: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>[] }&#62;`}   />




</div>
