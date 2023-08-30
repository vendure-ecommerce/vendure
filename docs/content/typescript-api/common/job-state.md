---
title: "JobState"
weight: 10
date: 2023-07-14T16:57:50.654Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# JobState
<div class="symbol">


# JobState

{{< generation-info sourceFile="packages/common/src/generated-types.ts" sourceLine="2072" packageName="@vendure/common">}}

The state of a Job in the JobQueue

## Signature

```TypeScript
enum JobState {
  CANCELLED = 'CANCELLED'
  COMPLETED = 'COMPLETED'
  FAILED = 'FAILED'
  PENDING = 'PENDING'
  RETRYING = 'RETRYING'
  RUNNING = 'RUNNING'
}
```
</div>
