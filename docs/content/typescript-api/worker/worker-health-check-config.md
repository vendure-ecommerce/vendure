---
title: "WorkerHealthCheckConfig"
weight: 10
date: 2023-07-14T16:57:50.652Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# WorkerHealthCheckConfig
<div class="symbol">


# WorkerHealthCheckConfig

{{< generation-info sourceFile="packages/core/src/worker/worker-health.service.ts" sourceLine="14" packageName="@vendure/core" since="1.2.0">}}

Specifies the configuration for the Worker's HTTP health check endpoint.

## Signature

```TypeScript
interface WorkerHealthCheckConfig {
  port: number;
  hostname?: string;
  route?: string;
}
```
## Members

### port

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The port on which the worker will listen{{< /member-description >}}

### hostname

{{< member-info kind="property" type="string" default="'localhost'"  >}}

{{< member-description >}}The hostname{{< /member-description >}}

### route

{{< member-info kind="property" type="string" default="'/health'"  >}}

{{< member-description >}}The route at which the health check is available.{{< /member-description >}}


</div>
