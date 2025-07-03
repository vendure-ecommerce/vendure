---
title: "Instrument"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Instrument

<GenerationInfo sourceFile="packages/core/src/common/instrument-decorator.ts" sourceLine="41" packageName="@vendure/core" since="3.3.0" />

This decorator is used to apply instrumentation to a class. It is intended to be used in conjunction
with an <a href='/reference/typescript-api/telemetry/instrumentation-strategy#instrumentationstrategy'>InstrumentationStrategy</a> which defines how the instrumentation should be applied.

In order for the instrumentation to be applied, the `VENDURE_ENABLE_INSTRUMENTATION` environment
variable (exported from the `@vendure/core` package as `ENABLE_INSTRUMENTATION_ENV_VAR`) must be set to `true`.
This is done to avoid the overhead of instrumentation in environments where it is not needed.

For more information on how instrumentation is used, see docs on the TelemetryPlugin.

*Example*

```ts
import { Instrument } from '@vendure/core';
import { Injectable } from '@nestjs/common';

@Injectable()
// highlight-next-line
@Instrument()
export class MyService {

  // Calls to this method will be instrumented
  myMethod() {
    // ...
  }
}
```

```ts title="Signature"
function Instrument(): ClassDecorator
```
