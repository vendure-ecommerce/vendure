---
title: "ProcessContext"
weight: 10
date: 2023-07-20T13:56:15.827Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProcessContext

<GenerationInfo sourceFile="packages/core/src/process-context/process-context.ts" sourceLine="31" packageName="@vendure/core" />

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

```ts title="Signature"
class ProcessContext {
  isServer: boolean
  isWorker: boolean
}
```

### isServer

<MemberInfo kind="property" type="boolean"   />


### isWorker

<MemberInfo kind="property" type="boolean"   />


