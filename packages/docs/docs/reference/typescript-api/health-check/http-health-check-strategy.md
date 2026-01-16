---
title: "HttpHealthCheckStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HttpHealthCheckStrategy

<GenerationInfo sourceFile="packages/core/src/health-check/http-health-check-strategy.ts" sourceLine="37" packageName="@vendure/core" />

A <a href='/reference/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> used to check health by pinging a url. Internally it uses
the [NestJS HttpHealthIndicator](https://docs.nestjs.com/recipes/terminus#http-healthcheck).

*Example*

```ts
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

```ts title="Signature"
class HttpHealthCheckStrategy implements HealthCheckStrategy {
    constructor(options: HttpHealthCheckOptions)
    init(injector: Injector) => ;
    getHealthIndicator() => HealthIndicatorFunction;
}
```
* Implements: <code><a href='/reference/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: HttpHealthCheckOptions) => HttpHealthCheckStrategy`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### getHealthIndicator

<MemberInfo kind="method" type={`() => HealthIndicatorFunction`}   />




</div>
