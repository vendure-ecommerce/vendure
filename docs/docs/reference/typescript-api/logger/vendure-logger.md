---
title: "VendureLogger"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VendureLogger

<GenerationInfo sourceFile="packages/core/src/config/logger/vendure-logger.ts" sourceLine="47" packageName="@vendure/core" />

The VendureLogger interface defines the shape of a logger service which may be provided in
the config.

```ts title="Signature"
interface VendureLogger {
    error(message: string, context?: string, trace?: string): void;
    warn(message: string, context?: string): void;
    info(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    setDefaultContext?(defaultContext: string): void;
}
```

<div className="members-wrapper">

### error

<MemberInfo kind="method" type={`(message: string, context?: string, trace?: string) => void`}   />


### warn

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### info

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### verbose

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### debug

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### setDefaultContext

<MemberInfo kind="method" type={`(defaultContext: string) => void`}   />




</div>
