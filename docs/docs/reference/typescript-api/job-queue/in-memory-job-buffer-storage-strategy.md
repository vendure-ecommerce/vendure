---
title: "InMemoryJobBufferStorageStrategy"
weight: 10
date: 2023-07-20T13:56:15.668Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InMemoryJobBufferStorageStrategy

<GenerationInfo sourceFile="packages/core/src/job-queue/job-buffer/in-memory-job-buffer-storage-strategy.ts" sourceLine="17" packageName="@vendure/core" since="1.3.0" />

A <a href='/typescript-api/job-queue/job-buffer-storage-strategy#jobbufferstoragestrategy'>JobBufferStorageStrategy</a> which keeps the buffered jobs in memory. Should
_not_ be used in production, since it will lose data in the event of the server
stopping.

Instead, use the <a href='/typescript-api/job-queue/default-job-queue-plugin#defaultjobqueueplugin'>DefaultJobQueuePlugin</a> with the `useDatabaseForBuffer: true` option set,
or the <a href='/typescript-api/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a> or another custom strategy with persistent storage.

```ts title="Signature"
class InMemoryJobBufferStorageStrategy implements JobBufferStorageStrategy {
  protected protected bufferStorage = new Map<string, Set<Job>>();
  async add(bufferId: string, job: Job) => Promise<Job>;
  async bufferSize(bufferIds?: string[]) => Promise<{ [bufferId: string]: number }>;
  async flush(bufferIds?: string[]) => Promise<{ [bufferId: string]: Job[] }>;
}
```
Implements

 * <a href='/typescript-api/job-queue/job-buffer-storage-strategy#jobbufferstoragestrategy'>JobBufferStorageStrategy</a>



### bufferStorage

<MemberInfo kind="property" type=""   />


### add

<MemberInfo kind="method" type="(bufferId: string, job: <a href='/typescript-api/job-queue/job#job'>Job</a>) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>&#62;"   />


### bufferSize

<MemberInfo kind="method" type="(bufferIds?: string[]) => Promise&#60;{ [bufferId: string]: number }&#62;"   />


### flush

<MemberInfo kind="method" type="(bufferIds?: string[]) => Promise&#60;{ [bufferId: string]: <a href='/typescript-api/job-queue/job#job'>Job</a>[] }&#62;"   />


