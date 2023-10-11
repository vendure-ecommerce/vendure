---
title: "TestingLogger"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TestingLogger

<GenerationInfo sourceFile="packages/testing/src/testing-logger.ts" sourceLine="55" packageName="@vendure/testing" />

The TestingLogger can be used in unit tests or e2e tests to make assertions on whether the various
Logger methods have been called, and which arguments.

Here's some examples of how to use it in e2e tests and unit tests. In both cases we are using
the Jest testing framework, but the TestingLogger should work with other similar frameworks
(e.g. replacing `jest.fn()` with `jasmine.createSpy()`).

*Example*

```ts
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

```ts
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

```ts title="Signature"
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
* Implements: <code><a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(createSpyFn: () =&#62; Spy) => TestingLogger`}   />


### debugSpy

<MemberInfo kind="property" type={`Spy`}   />


### errorSpy

<MemberInfo kind="property" type={`Spy`}   />


### infoSpy

<MemberInfo kind="property" type={`Spy`}   />


### verboseSpy

<MemberInfo kind="property" type={`Spy`}   />


### warnSpy

<MemberInfo kind="property" type={`Spy`}   />


### debug

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### error

<MemberInfo kind="method" type={`(message: string, context?: string, trace?: string) => void`}   />


### info

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### verbose

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### warn

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />




</div>
