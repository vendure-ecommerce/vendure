---
title: "WorkerHealthCheckConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## WorkerHealthCheckConfig

<GenerationInfo sourceFile="packages/core/src/worker/worker-health.service.ts" sourceLine="14" packageName="@vendure/core" since="1.2.0" />

Specifies the configuration for the Worker's HTTP health check endpoint.

```ts title="Signature"
interface WorkerHealthCheckConfig {
    port: number;
    hostname?: string;
    route?: string;
}
```

<div className="members-wrapper">

### port

<MemberInfo kind="property" type={`number`}   />

The port on which the worker will listen
### hostname

<MemberInfo kind="property" type={`string`} default={`'localhost'`}   />

The hostname
### route

<MemberInfo kind="property" type={`string`} default={`'/health'`}   />

The route at which the health check is available.


</div>
