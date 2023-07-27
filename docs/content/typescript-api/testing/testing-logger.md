---
title: "TestingLogger"
weight: 10
date: 2023-07-14T16:57:50.820Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TestingLogger
<div class="symbol">


# TestingLogger

{{< generation-info sourceFile="packages/testing/src/testing-logger.ts" sourceLine="55" packageName="@vendure/testing">}}

The TestingLogger can be used in unit tests or e2e tests to make assertions on whether the various
Logger methods have been called, and which arguments.

Here's some examples of how to use it in e2e tests and unit tests. In both cases we are using
the Jest testing framework, but the TestingLogger should work with other similar frameworks
(e.g. replacing `jest.fn()` with `jasmine.createSpy()`).

*Example*

```TypeScript
// e2e test example
import { createTestEnvironment, TestingLogger } from '@vendure/testing';

const testingLogger = new TestingLogger(() => jest.fn());

const { server, adminClient, shopClient } = createTestEnvironment({
  ...testConfig,
  logger: testingLogger,
});

// e2e testing setup omitted

it('should log an error', async () => {
  // The `errorSpy` property exposes the Jest mock function
  testingLogger.errorSpy.mockClear();

  await doSomethingThatErrors();

  expect(testingLogger.errorSpy).toHaveBeenCalled();
});
```

*Example*

```TypeScript
// unit test example
import { Test } from '@nestjs/testing';
import { Logger } from '@vendure/core';
import { TestingLogger } from '@vendure/testing';

beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({
    // Nest testing setup omitted
  }).compile();

  Logger.useLogger(testingLogger);
  moduleRef.useLogger(new Logger());
}
```

## Signature

```TypeScript
class TestingLogger<Spy extends (...args: any[]) => any> implements VendureLogger {
  constructor(createSpyFn: () => Spy)
  debugSpy: Spy;
  errorSpy: Spy;
  infoSpy: Spy;
  verboseSpy: Spy;
  warnSpy: Spy;
  debug(message: string, context?: string) => void;
  error(message: string, context?: string, trace?: string) => void;
  info(message: string, context?: string) => void;
  verbose(message: string, context?: string) => void;
  warn(message: string, context?: string) => void;
}
```
## Implements

 * <a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>


## Members

### constructor

{{< member-info kind="method" type="(createSpyFn: () =&#62; Spy) => TestingLogger"  >}}

{{< member-description >}}{{< /member-description >}}

### debugSpy

{{< member-info kind="property" type="Spy"  >}}

{{< member-description >}}{{< /member-description >}}

### errorSpy

{{< member-info kind="property" type="Spy"  >}}

{{< member-description >}}{{< /member-description >}}

### infoSpy

{{< member-info kind="property" type="Spy"  >}}

{{< member-description >}}{{< /member-description >}}

### verboseSpy

{{< member-info kind="property" type="Spy"  >}}

{{< member-description >}}{{< /member-description >}}

### warnSpy

{{< member-info kind="property" type="Spy"  >}}

{{< member-description >}}{{< /member-description >}}

### debug

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### error

{{< member-info kind="method" type="(message: string, context?: string, trace?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### info

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### verbose

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### warn

{{< member-info kind="method" type="(message: string, context?: string) => void"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
