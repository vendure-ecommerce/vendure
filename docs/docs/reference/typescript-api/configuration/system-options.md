---
title: "SystemOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SystemOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="994" packageName="@vendure/core" since="1.6.0" />

Options relating to system functions.

```ts title="Signature"
interface SystemOptions {
    healthChecks?: HealthCheckStrategy[];
}
```

<div className="members-wrapper">

### healthChecks

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a>[]`} default="[<a href='/reference/typescript-api/health-check/type-ormhealth-check-strategy#typeormhealthcheckstrategy'>TypeORMHealthCheckStrategy</a>]"  since="1.6.0"  />

Defines an array of <a href='/reference/typescript-api/health-check/health-check-strategy#healthcheckstrategy'>HealthCheckStrategy</a> instances which are used by the `/health` endpoint to verify
that any critical systems which the Vendure server depends on are also healthy.


</div>
