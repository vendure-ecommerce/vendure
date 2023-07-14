---
title: "TypeORMHealthCheckStrategy"
weight: 10
date: 2023-07-14T16:57:50.131Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TypeORMHealthCheckStrategy
<div class="symbol">


# TypeORMHealthCheckStrategy

{{< generation-info sourceFile="packages/core/src/health-check/typeorm-health-check-strategy.ts" sourceLine="36" packageName="@vendure/core">}}

A <a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> used to check the health of the database. This health
check is included by default, but can be customized by explicitly adding it to the
`systemOptions.healthChecks` array:

*Example*

```TypeScript
import { TypeORMHealthCheckStrategy } from '@vendure/core';

export const config = {
  // ...
  systemOptions: [
    // The default key is "database" and the default timeout is 1000ms
    // Sometimes this is too short and leads to false negatives in the
    // /health endpoint.
    new TypeORMHealthCheckStrategy({ key: 'postgres-db', timeout: 5000 }),
  ]
}
```

## Signature

```TypeScript
class TypeORMHealthCheckStrategy implements HealthCheckStrategy {
  constructor(options?: TypeORMHealthCheckOptions)
  async init(injector: Injector) => ;
  getHealthIndicator() => HealthIndicatorFunction;
}
```
## Implements

 * <a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(options?: TypeORMHealthCheckOptions) => TypeORMHealthCheckStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getHealthIndicator

{{< member-info kind="method" type="() => HealthIndicatorFunction"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
