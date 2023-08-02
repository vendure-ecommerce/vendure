---
title: "PluginCommonModule"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PluginCommonModule

<GenerationInfo sourceFile="packages/core/src/plugin/plugin-common.module.ts" sourceLine="30" packageName="@vendure/core" />

This module provides the common services, configuration, and event bus capabilities
required by a typical plugin. It should be imported into plugins to avoid having to
repeat the same boilerplate for each individual plugin.

The PluginCommonModule exports:

* `EventBusModule`, allowing the injection of the <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a> service.
* `ServiceModule` allowing the injection of any of the various entity services such as ProductService, OrderService etc.
* `ConfigModule`, allowing the injection of the ConfigService.
* `JobQueueModule`, allowing the injection of the <a href='/reference/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a>.
* `HealthCheckModule`, allowing the injection of the <a href='/reference/typescript-api/health-check/health-check-registry-service#healthcheckregistryservice'>HealthCheckRegistryService</a>.

```ts title="Signature"
class PluginCommonModule {

}
```
