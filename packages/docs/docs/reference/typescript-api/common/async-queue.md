---
title: "AsyncQueue"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AsyncQueue

<GenerationInfo sourceFile="packages/core/src/common/async-queue.ts" sourceLine="13" packageName="@vendure/core" />

A queue class for limiting concurrent async tasks. This can be used e.g. to prevent
race conditions when working on a shared resource such as writing to a database.

```ts title="Signature"
class AsyncQueue {
    constructor(label: string = 'default', concurrency: number = 1)
    push(task: Task<T>) => Promise<T>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(label: string = 'default', concurrency: number = 1) => AsyncQueue`}   />


### push

<MemberInfo kind="method" type={`(task: Task&#60;T&#62;) => Promise&#60;T&#62;`}   />

Pushes a new task onto the queue, upon which the task will either execute immediately or
(if the number of running tasks is equal to the concurrency limit) enqueue the task to
be executed at the soonest opportunity.


</div>
