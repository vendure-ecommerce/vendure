---
title: "HealthCheckRegistryService"
weight: 10
date: 2023-07-14T16:57:50.128Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HealthCheckRegistryService
<div class="symbol">


# HealthCheckRegistryService

{{< generation-info sourceFile="packages/core/src/health-check/health-check-registry.service.ts" sourceLine="47" packageName="@vendure/core">}}

This service is used to register health indicator functions to be included in the
health check. Health checks can be used by automated services such as Kubernetes
to determine the state of applications it is running. They are also useful for
administrators to get an overview of the health of all the parts of the
Vendure stack.

It wraps the [Nestjs Terminus module](https://docs.nestjs.com/recipes/terminus),
so see those docs for information on creating custom health checks.

Plugins which rely on external services (web services, databases etc.) can make use of this
service to add a check for that dependency to the Vendure health check.


Since v1.6.0, the preferred way to implement a custom health check is by creating a new
<a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> and then passing it to the `systemOptions.healthChecks` array.
See the <a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> docs for an example configuration.

The alternative way to register a health check is by injecting this service directly into your
plugin module. To use it in your plugin, you'll need to import the <a href='/typescript-api/plugin/plugin-common-module#plugincommonmodule'>PluginCommonModule</a>:

*Example*

```TypeScript
import { HealthCheckRegistryService, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { TerminusModule } from '@nestjs/terminus';

@VendurePlugin({
  imports: [PluginCommonModule, TerminusModule],
})
export class MyPlugin {
  constructor(
    private registry: HealthCheckRegistryService
    private httpIndicator: HttpHealthIndicator
  ) {
    registry.registerIndicatorFunction(
      () => this.httpIndicator.pingCheck('vendure-docs', 'https://www.vendure.io/docs/'),
    )
  }
}
```

## Signature

```TypeScript
class HealthCheckRegistryService {
  registerIndicatorFunction(fn: HealthIndicatorFunction | HealthIndicatorFunction[]) => ;
}
```
## Members

### registerIndicatorFunction

{{< member-info kind="method" type="(fn: HealthIndicatorFunction | HealthIndicatorFunction[]) => "  >}}

{{< member-description >}}Registers one or more `HealthIndicatorFunctions` (see [Nestjs docs](https://docs.nestjs.com/recipes/terminus#setting-up-a-healthcheck))
to be added to the health check endpoint.
The indicator will also appear in the Admin UI's "system status" view.{{< /member-description >}}


</div>
