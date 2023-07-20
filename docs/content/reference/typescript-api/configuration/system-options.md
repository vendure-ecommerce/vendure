---
title: "SystemOptions"
weight: 10
date: 2023-07-14T16:57:49.770Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SystemOptions
<div class="symbol">


# SystemOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="993" packageName="@vendure/core" since="1.6.0">}}

Options relating to system functions.

## Signature

```TypeScript
interface SystemOptions {
  healthChecks?: HealthCheckStrategy[];
}
```
## Members

### healthChecks

{{< member-info kind="property" type="<a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a>[]" default="[<a href='/typescript-api/health-check/type-ormhealth-check-strategy#typeormhealthcheckstrategy'>TypeORMHealthCheckStrategy</a>]"  since="1.6.0" >}}

{{< member-description >}}Defines an array of <a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> instances which are used by the `/health` endpoint to verify
that any critical systems which the Vendure server depends on are also healthy.{{< /member-description >}}


</div>
