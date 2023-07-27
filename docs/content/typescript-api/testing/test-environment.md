---
title: "TestEnvironment"
weight: 10
date: 2023-07-14T16:57:50.802Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TestEnvironment
<div class="symbol">


# TestEnvironment

{{< generation-info sourceFile="packages/testing/src/create-test-environment.ts" sourceLine="13" packageName="@vendure/testing">}}

The return value of <a href='/typescript-api/testing/create-test-environment#createtestenvironment'>createTestEnvironment</a>, containing the test server
and clients for the Shop API and Admin API.

## Signature

```TypeScript
interface TestEnvironment {
  server: TestServer;
  adminClient: SimpleGraphQLClient;
  shopClient: SimpleGraphQLClient;
}
```
## Members

### server

{{< member-info kind="property" type="<a href='/typescript-api/testing/test-server#testserver'>TestServer</a>"  >}}

{{< member-description >}}A Vendure server instance against which GraphQL requests can be made.{{< /member-description >}}

### adminClient

{{< member-info kind="property" type="<a href='/typescript-api/testing/simple-graph-qlclient#simplegraphqlclient'>SimpleGraphQLClient</a>"  >}}

{{< member-description >}}A GraphQL client configured for the Admin API.{{< /member-description >}}

### shopClient

{{< member-info kind="property" type="<a href='/typescript-api/testing/simple-graph-qlclient#simplegraphqlclient'>SimpleGraphQLClient</a>"  >}}

{{< member-description >}}A GraphQL client configured for the Shop API.{{< /member-description >}}


</div>
