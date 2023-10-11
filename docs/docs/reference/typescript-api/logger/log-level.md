---
title: "LogLevel"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## LogLevel

<GenerationInfo sourceFile="packages/core/src/config/logger/vendure-logger.ts" sourceLine="9" packageName="@vendure/core" />

An enum of valid logging levels.

```ts title="Signature"
enum LogLevel {
    // Log Errors only. These are usually indicative of some potentially
serious issue, so should be acted upon.
    Error = 0
    // Warnings indicate that some situation may require investigation
and handling. But not as serious as an Error.
    Warn = 1
    // Logs general information such as startup messages.
    Info = 2
    // Logs additional information
    Verbose = 3
    // Logs detailed info useful in debug scenarios, including stack traces for
all errors. In production this would probably generate too much noise.
    Debug = 4
}
```
