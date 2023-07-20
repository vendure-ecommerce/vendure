---
title: "JobQueueOptions"
weight: 10
date: 2023-07-14T16:57:49.768Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# JobQueueOptions
<div class="symbol">


# JobQueueOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="872" packageName="@vendure/core">}}

Options related to the built-in job queue.

## Signature

```TypeScript
interface JobQueueOptions {
  jobQueueStrategy?: JobQueueStrategy;
  jobBufferStorageStrategy?: JobBufferStorageStrategy;
  activeQueues?: string[];
  prefix?: string;
}
```
## Members

### jobQueueStrategy

{{< member-info kind="property" type="<a href='/typescript-api/job-queue/job-queue-strategy#jobqueuestrategy'>JobQueueStrategy</a>" default="<a href='/typescript-api/job-queue/in-memory-job-queue-strategy#inmemoryjobqueuestrategy'>InMemoryJobQueueStrategy</a>"  >}}

{{< member-description >}}Defines how the jobs in the queue are persisted and accessed.{{< /member-description >}}

### jobBufferStorageStrategy

{{< member-info kind="property" type="<a href='/typescript-api/job-queue/job-buffer-storage-strategy#jobbufferstoragestrategy'>JobBufferStorageStrategy</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### activeQueues

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}Defines the queues that will run in this process.
This can be used to configure only certain queues to run in this process.
If its empty all queues will be run. Note: this option is primarily intended
to apply to the Worker process. Jobs will _always_ get published to the queue
regardless of this setting, but this setting determines whether they get
_processed_ or not.{{< /member-description >}}

### prefix

{{< member-info kind="property" type="string"  since="1.5.0" >}}

{{< member-description >}}Prefixes all job queue names with the passed string. This is useful with multiple deployments
in cloud environments using services such as Amazon SQS or Google Cloud Tasks.

For example, we might have a staging and a production deployment in the same account/project and
each one will need its own task queue. We can achieve this with a prefix.{{< /member-description >}}


</div>
