---
title: "CreateTestEnvironment"
weight: 10
date: 2023-07-14T16:57:50.804Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# createTestEnvironment
<div class="symbol">


# createTestEnvironment

{{< generation-info sourceFile="packages/testing/src/create-test-environment.ts" sourceLine="60" packageName="@vendure/testing">}}

Configures a <a href='/typescript-api/testing/test-server#testserver'>TestServer</a> and a <a href='/typescript-api/testing/simple-graph-qlclient#simplegraphqlclient'>SimpleGraphQLClient</a> for each of the GraphQL APIs
for use in end-to-end tests. Returns a <a href='/typescript-api/testing/test-environment#testenvironment'>TestEnvironment</a> object.

*Example*

```TypeScript
import { createTestEnvironment, testConfig } from '@vendure/testing';

describe('some feature to test', () => {

  const { server, adminClient, shopClient } = createTestEnvironment(testConfig);

  beforeAll(async () => {
    await server.init({
        // ... server options
    });
    await adminClient.asSuperAdmin();
  });

  afterAll(async () => {
      await server.destroy();
  });

  // ... end-to-end tests here
});
```

## Signature

```TypeScript
function createTestEnvironment(config: Required<VendureConfig>): TestEnvironment
```
## Parameters

### config

{{< member-info kind="parameter" type="Required&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;" >}}

</div>
