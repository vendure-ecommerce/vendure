---
title: "LogLevel"
weight: 10
date: 2023-07-14T16:57:49.565Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LogLevel
<div class="symbol">


# LogLevel

{{< generation-info sourceFile="packages/core/src/config/logger/vendure-logger.ts" sourceLine="9" packageName="@vendure/core">}}

An enum of valid logging levels.

## Signature

```TypeScript
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
</div>
