---
title: "TestServer"
weight: 10
date: 2023-07-14T16:57:50.817Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TestServer
<div class="symbol">


# TestServer

{{< generation-info sourceFile="packages/testing/src/test-server.ts" sourceLine="18" packageName="@vendure/testing">}}

A real Vendure server against which the e2e tests should be run.

## Signature

```TypeScript
class TestServer {
  public public app: INestApplication;
  constructor(vendureConfig: Required<VendureConfig>)
  async init(options: TestServerOptions) => Promise<void>;
  async bootstrap() => ;
  async destroy() => ;
}
```
## Members

### app

{{< member-info kind="property" type="INestApplication"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(vendureConfig: Required&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;) => TestServer"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/testing/test-server-options#testserveroptions'>TestServerOptions</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Bootstraps an instance of Vendure server and populates the database according to the options
passed in. Should be called in the `beforeAll` function.

The populated data is saved into an .sqlite file for each test file. On subsequent runs, this file
is loaded so that the populate step can be skipped, which speeds up the tests significantly.{{< /member-description >}}

### bootstrap

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Bootstraps a Vendure server instance. Generally the `.init()` method should be used, as that will also
populate the test data. However, the `bootstrap()` method is sometimes useful in tests which need to
start and stop a Vendure instance multiple times without re-populating data.{{< /member-description >}}

### destroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Destroy the Vendure server instance and clean up all resources.
Should be called after all tests have run, e.g. in an `afterAll` function.{{< /member-description >}}


</div>
