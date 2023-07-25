---
title: "HealthCheckStrategy"
weight: 10
date: 2023-07-14T16:57:49.708Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HealthCheckStrategy
<div class="symbol">


# HealthCheckStrategy

{{< generation-info sourceFile="packages/core/src/config/system/health-check-strategy.ts" sourceLine="42" packageName="@vendure/core">}}

This strategy defines health checks which are included as part of the
`/health` endpoint. They should only be used to monitor _critical_ systems
on which proper functioning of the Vendure server depends.

For more information on the underlying mechanism, see the
[NestJS Terminus module docs](https://docs.nestjs.com/recipes/terminus).

Custom strategies should be added to the `systemOptions.healthChecks` array.
By default, Vendure includes the `TypeORMHealthCheckStrategy`, so if you set the value of the `healthChecks`
array, be sure to include it manually.

Vendure also ships with the <a href='/typescript-api/health-check/http-health-check-strategy#httphealthcheckstrategy'>HttpHealthCheckStrategy</a>, which is convenient
for adding a health check dependent on an HTTP ping.

*Example*

```TypeScript
import { HttpHealthCheckStrategy, TypeORMHealthCheckStrategy } from '@vendure/core';
import { MyCustomHealthCheckStrategy } from './config/custom-health-check-strategy';

export const config = {
  // ...
  systemOptions: {
    healthChecks: [
      new TypeORMHealthCheckStrategy(),
      new HttpHealthCheckStrategy({ key: 'my-service', url: 'https://my-service.com' }),
      new MyCustomHealthCheckStrategy(),
    ],
  },
};
```

## Signature

```TypeScript
interface HealthCheckStrategy extends InjectableStrategy {
  getHealthIndicator(): HealthIndicatorFunction;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### getHealthIndicator

{{< member-info kind="method" type="() => HealthIndicatorFunction"  >}}

{{< member-description >}}Should return a `HealthIndicatorFunction`, as defined by the
[NestJS Terminus module](https://docs.nestjs.com/recipes/terminus).{{< /member-description >}}


</div>
