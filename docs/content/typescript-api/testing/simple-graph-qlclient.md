---
title: "SimpleGraphQLClient"
weight: 10
date: 2023-07-14T16:57:50.810Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SimpleGraphQLClient
<div class="symbol">


# SimpleGraphQLClient

{{< generation-info sourceFile="packages/testing/src/simple-graphql-client.ts" sourceLine="40" packageName="@vendure/testing">}}

A minimalistic GraphQL client for populating and querying test data.

## Signature

```TypeScript
class SimpleGraphQLClient {
  constructor(vendureConfig: Required<VendureConfig>, apiUrl: string = '')
  setAuthToken(token: string) => ;
  setChannelToken(token: string | null) => ;
  getAuthToken() => string;
  async query(query: DocumentNode | TypedDocumentNode<T, V>, variables?: V, queryParams?: QueryParams) => Promise<T>;
  async fetch(url: string, options: RequestInit = {}) => Promise<Response>;
  async queryStatus(query: DocumentNode, variables?: V) => Promise<number>;
  async asUserWithCredentials(username: string, password: string) => ;
  async asSuperAdmin() => ;
  async asAnonymousUser() => ;
  async fileUploadMutation(options: {
        mutation: DocumentNode;
        filePaths: string[];
        mapVariables: (filePaths: string[]) => any;
    }) => Promise<any>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(vendureConfig: Required&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;, apiUrl: string = '') => SimpleGraphQLClient"  >}}

{{< member-description >}}{{< /member-description >}}

### setAuthToken

{{< member-info kind="method" type="(token: string) => "  >}}

{{< member-description >}}Sets the authToken to be used in each GraphQL request.{{< /member-description >}}

### setChannelToken

{{< member-info kind="method" type="(token: string | null) => "  >}}

{{< member-description >}}Sets the authToken to be used in each GraphQL request.{{< /member-description >}}

### getAuthToken

{{< member-info kind="method" type="() => string"  >}}

{{< member-description >}}Returns the authToken currently being used.{{< /member-description >}}

### query

{{< member-info kind="method" type="(query: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, queryParams?: QueryParams) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Performs both query and mutation operations.{{< /member-description >}}

### fetch

{{< member-info kind="method" type="(url: string, options: RequestInit = {}) => Promise&#60;Response&#62;"  >}}

{{< member-description >}}Performs a raw HTTP request to the given URL, but also includes the authToken & channelToken
headers if they have been set. Useful for testing non-GraphQL endpoints, e.g. for plugins
which make use of REST controllers.{{< /member-description >}}

### queryStatus

{{< member-info kind="method" type="(query: DocumentNode, variables?: V) => Promise&#60;number&#62;"  >}}

{{< member-description >}}Performs a query or mutation and returns the resulting status code.{{< /member-description >}}

### asUserWithCredentials

{{< member-info kind="method" type="(username: string, password: string) => "  >}}

{{< member-description >}}Attemps to log in with the specified credentials.{{< /member-description >}}

### asSuperAdmin

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Logs in as the SuperAdmin user.{{< /member-description >}}

### asAnonymousUser

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Logs out so that the client is then treated as an anonymous user.{{< /member-description >}}

### fileUploadMutation

{{< member-info kind="method" type="(options: {         mutation: DocumentNode;         filePaths: string[];         mapVariables: (filePaths: string[]) =&#62; any;     }) => Promise&#60;any&#62;"  >}}

{{< member-description >}}Perform a file upload mutation.

Upload spec: https://github.com/jaydenseric/graphql-multipart-request-spec
Discussion of issue: https://github.com/jaydenseric/apollo-upload-client/issues/32{{< /member-description >}}


</div>
