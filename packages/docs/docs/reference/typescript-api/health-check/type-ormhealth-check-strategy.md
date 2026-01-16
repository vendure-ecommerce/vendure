---
title: "TypeORMHealthCheckStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TypeORMHealthCheckStrategy

<GenerationInfo sourceFile="packages/core/src/health-check/typeorm-health-check-strategy.ts" sourceLine="38" packageName="@vendure/core" />

A <a href='/reference/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> used to check the health of the database. This health
check is included by default, but can be customized by explicitly adding it to the
`systemOptions.healthChecks` array:

*Example*

```ts
import { TypeORMHealthCheckStrategy } from '@vendure/core';

export const config = {
  // ...
  systemOptions: {
    healthChecks:[
        // The default key is "database" and the default timeout is 1000ms
        // Sometimes this is too short and leads to false negatives in the
        // /health endpoint.
        new TypeORMHealthCheckStrategy({ key: 'postgres-db', timeout: 5000 }),
    ]
  }
}
```

```ts title="Signature"
class TypeORMHealthCheckStrategy implements HealthCheckStrategy {
    constructor(options?: TypeORMHealthCheckOptions)
    init(injector: Injector) => ;
    getHealthIndicator() => HealthIndicatorFunction;
}
```
* Implements: <code><a href='/reference/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options?: TypeORMHealthCheckOptions) => TypeORMHealthCheckStrategy`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### getHealthIndicator

<MemberInfo kind="method" type={`() => HealthIndicatorFunction`}   />




</div>
