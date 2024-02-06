---
title: "BootstrapWorker"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## bootstrapWorker

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="102" packageName="@vendure/core" />

Bootstraps a Vendure worker. Resolves to a <a href='/reference/typescript-api/worker/vendure-worker#vendureworker'>VendureWorker</a> object containing a reference to the underlying
NestJs [standalone application](https://docs.nestjs.com/standalone-applications) as well as convenience
methods for starting the job queue and health check server.

Read more about the [Vendure Worker](/guides/developer-guide/worker-job-queue/).

*Example*

```ts
import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
  .then(worker => worker.startJobQueue())
  .then(worker => worker.startHealthCheckServer({ port: 3020 }))
  .catch(err => {
    console.log(err);
  });
```

```ts title="Signature"
function bootstrapWorker(userConfig: Partial<VendureConfig>): Promise<VendureWorker>
```
Parameters

### userConfig

<MemberInfo kind="parameter" type={`Partial&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;`} />

