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

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="170" packageName="@vendure/core" />

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
    process.exit(1);
  });
```

```ts title="Signature"
function bootstrapWorker(userConfig: Partial<VendureConfig>, options?: BootstrapWorkerOptions): Promise<VendureWorker>
```
Parameters

### userConfig

<MemberInfo kind="parameter" type={`Partial&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;`} />

### options

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/worker/bootstrap-worker#bootstrapworkeroptions'>BootstrapWorkerOptions</a>`} />



## BootstrapWorkerOptions

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="58" packageName="@vendure/core" since="2.2.0" />

Additional options that can be used to configure the bootstrap process of the
Vendure worker.

```ts title="Signature"
interface BootstrapWorkerOptions {
    nestApplicationContextOptions: NestApplicationContextOptions;
}
```

<div className="members-wrapper">

### nestApplicationContextOptions

<MemberInfo kind="property" type={`NestApplicationContextOptions`}   />

These options get passed directly to the `NestFactory.createApplicationContext` method.


</div>
