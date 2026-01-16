---
title: "TestEnvironment"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TestEnvironment

<GenerationInfo sourceFile="packages/testing/src/create-test-environment.ts" sourceLine="13" packageName="@vendure/testing" />

The return value of <a href='/reference/typescript-api/testing/create-test-environment#createtestenvironment'>createTestEnvironment</a>, containing the test server
and clients for the Shop API and Admin API.

```ts title="Signature"
interface TestEnvironment {
    server: TestServer;
    adminClient: SimpleGraphQLClient;
    shopClient: SimpleGraphQLClient;
}
```

<div className="members-wrapper">

### server

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/testing/test-server#testserver'>TestServer</a>`}   />

A Vendure server instance against which GraphQL requests can be made.
### adminClient

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/testing/simple-graph-qlclient#simplegraphqlclient'>SimpleGraphQLClient</a>`}   />

A GraphQL client configured for the Admin API.
### shopClient

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/testing/simple-graph-qlclient#simplegraphqlclient'>SimpleGraphQLClient</a>`}   />

A GraphQL client configured for the Shop API.


</div>
