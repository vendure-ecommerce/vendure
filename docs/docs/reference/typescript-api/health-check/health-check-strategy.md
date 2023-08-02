---
title: "HealthCheckStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HealthCheckStrategy

<GenerationInfo sourceFile="packages/core/src/config/system/health-check-strategy.ts" sourceLine="48" packageName="@vendure/core" />

This strategy defines health checks which are included as part of the
`/health` endpoint. They should only be used to monitor _critical_ systems
on which proper functioning of the Vendure server depends.

For more information on the underlying mechanism, see the
[NestJS Terminus module docs](https://docs.nestjs.com/recipes/terminus).

Custom strategies should be added to the `systemOptions.healthChecks` array.
By default, Vendure includes the `TypeORMHealthCheckStrategy`, so if you set the value of the `healthChecks`
array, be sure to include it manually.

Vendure also ships with the <a href='/reference/typescript-api/health-check/http-health-check-strategy#httphealthcheckstrategy'>HttpHealthCheckStrategy</a>, which is convenient
for adding a health check dependent on an HTTP ping.

:::info

This is configured via the `systemOptions.healthChecks` property of
your VendureConfig.

:::

*Example*

```ts
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

```ts title="Signature"
interface HealthCheckStrategy extends InjectableStrategy {
    getHealthIndicator(): HealthIndicatorFunction;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### getHealthIndicator

<MemberInfo kind="method" type={`() => HealthIndicatorFunction`}   />

Should return a `HealthIndicatorFunction`, as defined by the
[NestJS Terminus module](https://docs.nestjs.com/recipes/terminus).


</div>
