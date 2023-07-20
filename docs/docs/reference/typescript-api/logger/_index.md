---
title: "Logger"
weight: 10
date: 2023-07-14T16:57:49.570Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Logger
<div class="symbol">


# Logger

{{< generation-info sourceFile="packages/core/src/config/logger/vendure-logger.ts" sourceLine="136" packageName="@vendure/core">}}

The Logger is responsible for all logging in a Vendure application.

It is intended to be used as a static class:

*Example*

```ts
import { Logger } from '@vendure/core';

Logger.info(`Some log message`, 'My Vendure Plugin');
```

The actual implementation - where the logs are written to - is defined by the <a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>
instance configured in the <a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>. By default, the <a href='/typescript-api/logger/default-logger#defaultlogger'>DefaultLogger</a> is used, which
logs to the console.

## Implementing a custom logger

A custom logger can be passed to the `logger` config option by creating a class which implements the
<a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a> interface. For example, here is how you might go about implementing a logger which
logs to a file:

*Example*

```ts
import { VendureLogger } from '@vendure/core';
import fs from 'fs';

// A simple custom logger which writes all logs to a file.
export class SimpleFileLogger implements VendureLogger {
    private logfile: fs.WriteStream;

    constructor(logfileLocation: string) {
        this.logfile = fs.createWriteStream(logfileLocation, { flags: 'w' });
    }

    error(message: string, context?: string) {
        this.logfile.write(`ERROR: [${context}] ${message}\n`);
    }
    warn(message: string, context?: string) {
        this.logfile.write(`WARN: [${context}] ${message}\n`);
    }
    info(message: string, context?: string) {
        this.logfile.write(`INFO: [${context}] ${message}\n`);
    }
    verbose(message: string, context?: string) {
        this.logfile.write(`VERBOSE: [${context}] ${message}\n`);
    }
    debug(message: string, context?: string) {
        this.logfile.write(`DEBUG: [${context}] ${message}\n`);
    }
}

// in the VendureConfig
export const config = {
    // ...
    logger: new SimpleFileLogger('server.log'),
}
```

## Signature

```TypeScript
class Logger implements LoggerService {
  static logger: VendureLogger
  static error(message: string, context?: string, trace?: string) => void;
  static warn(message: string, context?: string) => void;
  static info(message: string, context?: string) => void;
  static verbose(message: string, context?: string) => void;
  static debug(message: string, context?: string) => void;
}
```
## Implements

 * LoggerService


## Members

### logger

{{< member-info kind="property" type="<a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### error

{{< member-info kind="method" type="(message: string, context?: string, trace?: string) => void"  >}}

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
