---
title: "CreateTestEnvironment"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## createTestEnvironment

<GenerationInfo sourceFile="packages/testing/src/create-test-environment.ts" sourceLine="60" packageName="@vendure/testing" />

Configures a <a href='/reference/typescript-api/testing/test-server#testserver'>TestServer</a> and a <a href='/reference/typescript-api/testing/simple-graph-qlclient#simplegraphqlclient'>SimpleGraphQLClient</a> for each of the GraphQL APIs
for use in end-to-end tests. Returns a <a href='/reference/typescript-api/testing/test-environment#testenvironment'>TestEnvironment</a> object.

*Example*

```ts
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

```ts title="Signature"
function createTestEnvironment(config: Required<VendureConfig>): TestEnvironment
```
Parameters

### config

<MemberInfo kind="parameter" type={`Required&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;`} />

