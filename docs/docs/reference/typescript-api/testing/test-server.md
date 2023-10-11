---
title: "TestServer"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TestServer

<GenerationInfo sourceFile="packages/testing/src/test-server.ts" sourceLine="18" packageName="@vendure/testing" />

A real Vendure server against which the e2e tests should be run.

```ts title="Signature"
class TestServer {
    public app: INestApplication;
    constructor(vendureConfig: Required<VendureConfig>)
    init(options: TestServerOptions) => Promise<void>;
    bootstrap() => ;
    destroy() => ;
}
```

<div className="members-wrapper">

### app

<MemberInfo kind="property" type={`INestApplication`}   />


### constructor

<MemberInfo kind="method" type={`(vendureConfig: Required&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;) => TestServer`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/testing/test-server-options#testserveroptions'>TestServerOptions</a>) => Promise&#60;void&#62;`}   />

Bootstraps an instance of Vendure server and populates the database according to the options
passed in. Should be called in the `beforeAll` function.

The populated data is saved into an .sqlite file for each test file. On subsequent runs, this file
is loaded so that the populate step can be skipped, which speeds up the tests significantly.
### bootstrap

<MemberInfo kind="method" type={`() => `}   />

Bootstraps a Vendure server instance. Generally the `.init()` method should be used, as that will also
populate the test data. However, the `bootstrap()` method is sometimes useful in tests which need to
start and stop a Vendure instance multiple times without re-populating data.
### destroy

<MemberInfo kind="method" type={`() => `}   />

Destroy the Vendure server instance and clean up all resources.
Should be called after all tests have run, e.g. in an `afterAll` function.


</div>
