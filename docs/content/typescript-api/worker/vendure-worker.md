---
title: "VendureWorker"
weight: 10
date: 2023-07-14T16:57:50.649Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# VendureWorker
<div class="symbol">


# VendureWorker

{{< generation-info sourceFile="packages/core/src/worker/vendure-worker.ts" sourceLine="13" packageName="@vendure/core">}}

This object is created by calling the <a href='/typescript-api/worker/bootstrap-worker#bootstrapworker'>bootstrapWorker</a> function.

## Signature

```TypeScript
class VendureWorker {
  public public app: INestApplicationContext;
  constructor(app: INestApplicationContext)
  async startJobQueue() => Promise<VendureWorker>;
  async startHealthCheckServer(healthCheckConfig: WorkerHealthCheckConfig) => Promise<VendureWorker>;
}
```
## Members

### app

{{< member-info kind="property" type="INestApplicationContext"  >}}

{{< member-description >}}A reference to the `INestApplicationContext` object, which represents
the NestJS [standalone application](https://docs.nestjs.com/standalone-applications) instance.{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(app: INestApplicationContext) => VendureWorker"  >}}

{{< member-description >}}{{< /member-description >}}

### startJobQueue

{{< member-info kind="method" type="() => Promise&#60;<a href='/typescript-api/worker/vendure-worker#vendureworker'>VendureWorker</a>&#62;"  >}}

{{< member-description >}}Starts the job queues running so that the worker can handle background jobs.{{< /member-description >}}

### startHealthCheckServer

{{< member-info kind="method" type="(healthCheckConfig: <a href='/typescript-api/worker/worker-health-check-config#workerhealthcheckconfig'>WorkerHealthCheckConfig</a>) => Promise&#60;<a href='/typescript-api/worker/vendure-worker#vendureworker'>VendureWorker</a>&#62;"  since="1.2.0" >}}

{{< member-description >}}Starts a simple http server which can be used as a health check on the worker instance.
This endpoint can be used by container orchestration services such as Kubernetes to
verify whether the worker is running.{{< /member-description >}}


</div>
