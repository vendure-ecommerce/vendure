---
title: "ProcessContext"
weight: 10
date: 2023-07-14T16:57:50.217Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProcessContext
<div class="symbol">


# ProcessContext

{{< generation-info sourceFile="packages/core/src/process-context/process-context.ts" sourceLine="31" packageName="@vendure/core">}}

The ProcessContext can be injected into your providers & modules in order to know whether it
is being executed in the context of the main Vendure server or the worker.

*Example*

```TypeScript
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProcessContext } from '@vendure/core';

@Injectable()
export class MyService implements OnApplicationBootstrap {
  constructor(private processContext: ProcessContext) {}

  onApplicationBootstrap() {
    if (this.processContext.isServer) {
      // code which will only execute when running in
      // the server process
    }
  }
}
```

## Signature

```TypeScript
class ProcessContext {
  isServer: boolean
  isWorker: boolean
}
```
## Members

### isServer

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### isWorker

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
