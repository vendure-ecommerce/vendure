---
title: "HttpHealthCheckStrategy"
weight: 10
date: 2023-07-14T16:57:50.129Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HttpHealthCheckStrategy
<div class="symbol">


# HttpHealthCheckStrategy

{{< generation-info sourceFile="packages/core/src/health-check/http-health-check-strategy.ts" sourceLine="36" packageName="@vendure/core">}}

A <a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> used to check health by pinging a url. Internally it uses
the [NestJS HttpHealthIndicator](https://docs.nestjs.com/recipes/terminus#http-healthcheck).

*Example*

```TypeScript
import { HttpHealthCheckStrategy, TypeORMHealthCheckStrategy } from '@vendure/core';

export const config = {
  // ...
  systemOptions: {
    healthChecks: [
      new TypeORMHealthCheckStrategy(),
      new HttpHealthCheckStrategy({ key: 'my-service', url: 'https://my-service.com' }),
    ]
  },
};
```

## Signature

```TypeScript
class HttpHealthCheckStrategy implements HealthCheckStrategy {
  constructor(options: HttpHealthCheckOptions)
  async init(injector: Injector) => ;
  getHealthIndicator() => HealthIndicatorFunction;
}
```
## Implements

 * <a href='/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(options: HttpHealthCheckOptions) => HttpHealthCheckStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getHealthIndicator

{{< member-info kind="method" type="() => HealthIndicatorFunction"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
