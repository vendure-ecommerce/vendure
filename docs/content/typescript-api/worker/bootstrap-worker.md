---
title: "BootstrapWorker"
weight: 10
date: 2023-07-14T16:57:49.413Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# bootstrapWorker
<div class="symbol">


# bootstrapWorker

{{< generation-info sourceFile="packages/core/src/bootstrap.ts" sourceLine="102" packageName="@vendure/core">}}

Bootstraps a Vendure worker. Resolves to a <a href='/typescript-api/worker/vendure-worker#vendureworker'>VendureWorker</a> object containing a reference to the underlying
NestJs [standalone application](https://docs.nestjs.com/standalone-applications) as well as convenience
methods for starting the job queue and health check server.

Read more about the [Vendure Worker]({{< relref "vendure-worker" >}}).

*Example*

```TypeScript
import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
  .then(worker => worker.startJobQueue())
  .then(worker => worker.startHealthCheckServer({ port: 3020 }))
  .catch(err => {
    console.log(err);
  });
```

## Signature

```TypeScript
function bootstrapWorker(userConfig: Partial<VendureConfig>): Promise<VendureWorker>
```
## Parameters

### userConfig

{{< member-info kind="parameter" type="Partial&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;" >}}

</div>
