---
title: "SimpleGraphQLClient"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SimpleGraphQLClient

<GenerationInfo sourceFile="packages/testing/src/simple-graphql-client.ts" sourceLine="40" packageName="@vendure/testing" />

A minimalistic GraphQL client for populating and querying test data.

```ts title="Signature"
class SimpleGraphQLClient {
    constructor(vendureConfig: Required<VendureConfig>, apiUrl: string = '')
    setAuthToken(token: string) => ;
    setChannelToken(token: string | null) => ;
    getAuthToken() => string;
    query(query: DocumentNode | TypedDocumentNode<T, V>, variables?: V, queryParams?: QueryParams) => Promise<T>;
    fetch(url: string, options: RequestInit = {}) => Promise<Response>;
    queryStatus(query: DocumentNode, variables?: V) => Promise<number>;
    asUserWithCredentials(username: string, password: string) => ;
    asSuperAdmin() => ;
    asAnonymousUser() => ;
    fileUploadMutation(options: {
        mutation: DocumentNode;
        filePaths: string[];
        mapVariables: (filePaths: string[]) => any;
    }) => Promise<any>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(vendureConfig: Required&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;, apiUrl: string = '') => SimpleGraphQLClient`}   />


### setAuthToken

<MemberInfo kind="method" type={`(token: string) => `}   />

Sets the authToken to be used in each GraphQL request.
### setChannelToken

<MemberInfo kind="method" type={`(token: string | null) => `}   />

Sets the authToken to be used in each GraphQL request.
### getAuthToken

<MemberInfo kind="method" type={`() => string`}   />

Returns the authToken currently being used.
### query

<MemberInfo kind="method" type={`(query: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, queryParams?: QueryParams) => Promise&#60;T&#62;`}   />

Performs both query and mutation operations.
### fetch

<MemberInfo kind="method" type={`(url: string, options: RequestInit = {}) => Promise&#60;Response&#62;`}   />

Performs a raw HTTP request to the given URL, but also includes the authToken & channelToken
headers if they have been set. Useful for testing non-GraphQL endpoints, e.g. for plugins
which make use of REST controllers.
### queryStatus

<MemberInfo kind="method" type={`(query: DocumentNode, variables?: V) => Promise&#60;number&#62;`}   />

Performs a query or mutation and returns the resulting status code.
### asUserWithCredentials

<MemberInfo kind="method" type={`(username: string, password: string) => `}   />

Attempts to log in with the specified credentials.
### asSuperAdmin

<MemberInfo kind="method" type={`() => `}   />

Logs in as the SuperAdmin user.
### asAnonymousUser

<MemberInfo kind="method" type={`() => `}   />

Logs out so that the client is then treated as an anonymous user.
### fileUploadMutation

<MemberInfo kind="method" type={`(options: {         mutation: DocumentNode;         filePaths: string[];         mapVariables: (filePaths: string[]) =&#62; any;     }) => Promise&#60;any&#62;`}   />

Perform a file upload mutation.

Upload spec: https://github.com/jaydenseric/graphql-multipart-request-spec
Discussion of issue: https://github.com/jaydenseric/apollo-upload-client/issues/32


</div>
