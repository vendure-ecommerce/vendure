---
title: "DefaultLogger"
weight: 10
date: 2023-07-14T16:57:49.560Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultLogger
<div class="symbol">


# DefaultLogger

{{< generation-info sourceFile="packages/core/src/config/logger/default-logger.ts" sourceLine="25" packageName="@vendure/core">}}

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

## Signature

```TypeScript
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
## Implements

 * <a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>


## Members

### constructor

{{< member-info kind="method" type="(options?: { level?: <a href='/typescript-api/logger/log-level#loglevel'>LogLevel</a>; timestamp?: boolean }) => DefaultLogger"  >}}

{{< member-description >}}{{< /member-description >}}

### setDefaultContext

{{< member-info kind="method" type="(defaultContext: string) => "  >}}

{{< member-description >}}{{< /member-description >}}

### error

{{< member-info kind="method" type="(message: string, context?: string, trace?: string | undefined) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### warn

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### info

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### verbose

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### debug

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
