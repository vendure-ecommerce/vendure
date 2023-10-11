---
title: "VendureWorker"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VendureWorker

<GenerationInfo sourceFile="packages/core/src/worker/vendure-worker.ts" sourceLine="13" packageName="@vendure/core" />

This object is created by calling the <a href='/reference/typescript-api/worker/bootstrap-worker#bootstrapworker'>bootstrapWorker</a> function.

```ts title="Signature"
class VendureWorker {
    public app: INestApplicationContext;
    constructor(app: INestApplicationContext)
    startJobQueue() => Promise<VendureWorker>;
    startHealthCheckServer(healthCheckConfig: WorkerHealthCheckConfig) => Promise<VendureWorker>;
}
```

<div className="members-wrapper">

### app

<MemberInfo kind="property" type={`INestApplicationContext`}   />

A reference to the `INestApplicationContext` object, which represents
the NestJS [standalone application](https://docs.nestjs.com/standalone-applications) instance.
### constructor

<MemberInfo kind="method" type={`(app: INestApplicationContext) => VendureWorker`}   />


### startJobQueue

<MemberInfo kind="method" type={`() => Promise&#60;<a href='/reference/typescript-api/worker/vendure-worker#vendureworker'>VendureWorker</a>&#62;`}   />

Starts the job queues running so that the worker can handle background jobs.
### startHealthCheckServer

<MemberInfo kind="method" type={`(healthCheckConfig: <a href='/reference/typescript-api/worker/worker-health-check-config#workerhealthcheckconfig'>WorkerHealthCheckConfig</a>) => Promise&#60;<a href='/reference/typescript-api/worker/vendure-worker#vendureworker'>VendureWorker</a>&#62;`}  since="1.2.0"  />

Starts a simple http server which can be used as a health check on the worker instance.
This endpoint can be used by container orchestration services such as Kubernetes to
verify whether the worker is running.


</div>
