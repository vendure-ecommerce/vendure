---
title: "AsyncQueue"
weight: 10
date: 2023-07-14T16:57:49.415Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AsyncQueue
<div class="symbol">


# AsyncQueue

{{< generation-info sourceFile="packages/core/src/common/async-queue.ts" sourceLine="13" packageName="@vendure/core">}}

A queue class for limiting concurrent async tasks. This can be used e.g. to prevent
race conditions when working on a shared resource such as writing to a database.

## Signature

```TypeScript
class AsyncQueue {
  constructor(label: string = 'default', concurrency: number = 1)
  push(task: Task<T>) => Promise<T>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(label: string = 'default', concurrency: number = 1) => AsyncQueue"  >}}

{{< member-description >}}{{< /member-description >}}

### push

{{< member-info kind="method" type="(task: Task&#60;T&#62;) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Pushes a new task onto the queue, upon which the task will either execute immediately or
(if the number of running tasks is equal to the concurrency limit) enqueue the task to
be executed at the soonest opportunity.{{< /member-description >}}


</div>
