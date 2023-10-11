---
title: "ApiOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ApiOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="64" packageName="@vendure/core" />

The ApiOptions define how the Vendure GraphQL APIs are exposed, as well as allowing the API layer
to be extended with middleware.

```ts title="Signature"
interface ApiOptions {
    hostname?: string;
    port: number;
    adminApiPath?: string;
    shopApiPath?: string;
    adminApiPlayground?: boolean | RenderPageOptions;
    shopApiPlayground?: boolean | RenderPageOptions;
    adminApiDebug?: boolean;
    shopApiDebug?: boolean;
    shopListQueryLimit?: number;
    adminListQueryLimit?: number;
    adminApiValidationRules?: Array<(context: ValidationContext) => any>;
    shopApiValidationRules?: Array<(context: ValidationContext) => any>;
    channelTokenKey?: string;
    cors?: boolean | CorsOptions;
    middleware?: Middleware[];
    apolloServerPlugins?: ApolloServerPlugin[];
    introspection?: boolean;
}
```

<div className="members-wrapper">

### hostname

<MemberInfo kind="property" type={`string`} default="''"   />

Set the hostname of the server. If not set, the server will be available on localhost.
### port

<MemberInfo kind="property" type={`number`} default="3000"   />

Which port the Vendure server should listen on.
### adminApiPath

<MemberInfo kind="property" type={`string`} default="'admin-api'"   />

The path to the admin GraphQL API.
### shopApiPath

<MemberInfo kind="property" type={`string`} default="'shop-api'"   />

The path to the shop GraphQL API.
### adminApiPlayground

<MemberInfo kind="property" type={`boolean | RenderPageOptions`} default="false"   />

The playground config to the admin GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
### shopApiPlayground

<MemberInfo kind="property" type={`boolean | RenderPageOptions`} default="false"   />

The playground config to the shop GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
### adminApiDebug

<MemberInfo kind="property" type={`boolean`} default="false"   />

The debug config to the admin GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
### shopApiDebug

<MemberInfo kind="property" type={`boolean`} default="false"   />

The debug config to the shop GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
### shopListQueryLimit

<MemberInfo kind="property" type={`number`} default="100"   />

The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
this is the upper limit of the `take` input option.
### adminListQueryLimit

<MemberInfo kind="property" type={`number`} default="1000"   />

The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
this is the upper limit of the `take` input option.
### adminApiValidationRules

<MemberInfo kind="property" type={`Array&#60;(context: ValidationContext) =&#62; any&#62;`} default="[]"   />

Custom functions to use as additional validation rules when validating the schema for the admin GraphQL API
[ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).
### shopApiValidationRules

<MemberInfo kind="property" type={`Array&#60;(context: ValidationContext) =&#62; any&#62;`} default="[]"   />

Custom functions to use as additional validation rules when validating the schema for the shop GraphQL API
[ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).
### channelTokenKey

<MemberInfo kind="property" type={`string`} default="'vendure-token'"   />

The name of the property which contains the token of the
active channel. This property can be included either in
the request header or as a query string.
### cors

<MemberInfo kind="property" type={`boolean | CorsOptions`} default="{ origin: true, credentials: true }"   />

Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).
### middleware

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/middleware#middleware'>Middleware</a>[]`} default="[]"   />

Custom Express or NestJS middleware for the server. More information can be found in the <a href='/reference/typescript-api/common/middleware#middleware'>Middleware</a> docs.
### apolloServerPlugins

<MemberInfo kind="property" type={`ApolloServerPlugin[]`} default="[]"   />

Custom [ApolloServerPlugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/) which
allow the extension of the Apollo Server, which is the underlying GraphQL server used by Vendure.

Apollo plugins can be used e.g. to perform custom data transformations on incoming operations or outgoing
data.
### introspection

<MemberInfo kind="property" type={`boolean`} default="true"  since="1.5.0"  />

Controls whether introspection of the GraphQL APIs is enabled. For production, it is recommended to disable
introspection, since exposing your entire schema can allow an attacker to trivially learn all operations
and much more easily find any potentially exploitable queries.

**Note:** when introspection is disabled, tooling which relies on it for things like autocompletion
will not work.

*Example*

```ts
{
  introspection: process.env.NODE_ENV !== 'production'
}
```


</div>
