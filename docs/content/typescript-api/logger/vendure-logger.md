---
title: "VendureLogger"
weight: 10
date: 2023-07-14T16:57:49.566Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# VendureLogger
<div class="symbol">


# VendureLogger

{{< generation-info sourceFile="packages/core/src/config/logger/vendure-logger.ts" sourceLine="47" packageName="@vendure/core">}}

The VendureLogger interface defines the shape of a logger service which may be provided in
the config.

## Signature

```TypeScript
interface VendureLogger {
  error(message: string, context?: string, trace?: string): void;
  warn(message: string, context?: string): void;
  info(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
  debug(message: string, context?: string): void;
  setDefaultContext?(defaultContext: string): void;
}
```
## Members

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

### setDefaultContext

{{< member-info kind="method" type="(defaultContext: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
