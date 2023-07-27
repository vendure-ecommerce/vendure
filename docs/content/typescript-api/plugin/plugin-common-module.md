---
title: "PluginCommonModule"
weight: 10
date: 2023-07-14T16:57:50.208Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PluginCommonModule
<div class="symbol">


# PluginCommonModule

{{< generation-info sourceFile="packages/core/src/plugin/plugin-common.module.ts" sourceLine="30" packageName="@vendure/core">}}

This module provides the common services, configuration, and event bus capabilities
required by a typical plugin. It should be imported into plugins to avoid having to
repeat the same boilerplate for each individual plugin.

The PluginCommonModule exports:

* `EventBusModule`, allowing the injection of the <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a> service.
* `ServiceModule` allowing the injection of any of the various entity services such as ProductService, OrderService etc.
* `ConfigModule`, allowing the injection of the ConfigService.
* `JobQueueModule`, allowing the injection of the <a href='/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a>.
* `HealthCheckModule`, allowing the injection of the <a href='/typescript-api/health-check/health-check-registry-service#healthcheckregistryservice'>HealthCheckRegistryService</a>.

## Signature

```TypeScript
class PluginCommonModule {

}
```
</div>
