---
title: "DefaultLogger"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultLogger

<GenerationInfo sourceFile="packages/core/src/config/logger/default-logger.ts" sourceLine="25" packageName="@vendure/core" />

The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
default Vendure configuration, you do not need to specify it explicitly in your server config. You would only need
to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.

*Example*

```ts
import { DefaultLogger, LogLevel, VendureConfig } from '@vendure/core';

export config: VendureConfig = {
    // ...
    logger: new DefaultLogger({ level: LogLevel.Debug, timestamp: false }),
}
```

```ts title="Signature"
class DefaultLogger implements VendureLogger {
    constructor(options?: { level?: LogLevel; timestamp?: boolean })
    setDefaultContext(defaultContext: string) => ;
    error(message: string, context?: string, trace?: string | undefined) => void;
    warn(message: string, context?: string) => void;
    info(message: string, context?: string) => void;
    verbose(message: string, context?: string) => void;
    debug(message: string, context?: string) => void;
}
```
* Implements: <code><a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options?: { level?: <a href='/reference/typescript-api/logger/log-level#loglevel'>LogLevel</a>; timestamp?: boolean }) => DefaultLogger`}   />


### setDefaultContext

<MemberInfo kind="method" type={`(defaultContext: string) => `}   />


### error

<MemberInfo kind="method" type={`(message: string, context?: string, trace?: string | undefined) => void`}   />


### warn

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### info

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### verbose

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### debug

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />




</div>
