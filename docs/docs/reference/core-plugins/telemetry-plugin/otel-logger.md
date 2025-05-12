---
title: "OtelLogger"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OtelLogger

<GenerationInfo sourceFile="packages/telemetry-plugin/src/config/otel-logger.ts" sourceLine="46" packageName="@vendure/telemetry-plugin" since="3.3.0" />

A logger that emits logs to OpenTelemetry and optionally to the console.

```ts title="Signature"
class OtelLogger implements VendureLogger {
    constructor(options: OtelLoggerOptions)
    debug(message: string, context?: string) => void;
    warn(message: string, context?: string) => void;
    info(message: string, context?: string) => void;
    error(message: string, context?: string) => void;
    verbose(message: string, context?: string) => void;
}
```
* Implements: <code><a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/telemetry-plugin/otel-logger#otelloggeroptions'>OtelLoggerOptions</a>) => OtelLogger`}   />


### debug

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### warn

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### info

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### error

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### verbose

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />




</div>


## OtelLoggerOptions

<GenerationInfo sourceFile="packages/telemetry-plugin/src/config/otel-logger.ts" sourceLine="14" packageName="@vendure/telemetry-plugin" since="3.3.0" />

Options for the OtelLogger.

```ts title="Signature"
interface OtelLoggerOptions {
    logToConsole?: LogLevel;
}
```

<div className="members-wrapper">

### logToConsole

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/logger/log-level#loglevel'>LogLevel</a>`}   />

If set to a LogLevel, the logger will also log to the console.
This can be useful for local development or debugging.

*Example*

```ts
import { LogLevel } from '@vendure/core';
import { TelemetryPlugin } from '@vendure/telemetry-plugin';

// ...

TelemetryPlugin.init({
  loggerOptions: {
    logToConsole: LogLevel.Verbose,
  },
});
```


</div>
