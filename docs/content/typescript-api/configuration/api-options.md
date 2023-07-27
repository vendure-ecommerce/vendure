---
title: "ApiOptions"
weight: 10
date: 2023-07-14T16:57:49.717Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ApiOptions
<div class="symbol">


# ApiOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="63" packageName="@vendure/core">}}

The ApiOptions define how the Vendure GraphQL APIs are exposed, as well as allowing the API layer
to be extended with middleware.

## Signature

```TypeScript
interface ApiOptions {
  hostname?: string;
  port: number;
  adminApiPath?: string;
  shopApiPath?: string;
  adminApiPlayground?: boolean | any;
  shopApiPlayground?: boolean | any;
  adminApiDebug?: boolean;
  shopApiDebug?: boolean;
  shopListQueryLimit?: number;
  adminListQueryLimit?: number;
  adminApiValidationRules?: Array<(context: ValidationContext) => any>;
  shopApiValidationRules?: Array<(context: ValidationContext) => any>;
  channelTokenKey?: string;
  cors?: boolean | CorsOptions;
  middleware?: Middleware[];
  apolloServerPlugins?: PluginDefinition[];
  introspection?: boolean;
}
```
## Members

### hostname

{{< member-info kind="property" type="string" default="''"  >}}

{{< member-description >}}Set the hostname of the server. If not set, the server will be available on localhost.{{< /member-description >}}

### port

{{< member-info kind="property" type="number" default="3000"  >}}

{{< member-description >}}Which port the Vendure server should listen on.{{< /member-description >}}

### adminApiPath

{{< member-info kind="property" type="string" default="'admin-api'"  >}}

{{< member-description >}}The path to the admin GraphQL API.{{< /member-description >}}

### shopApiPath

{{< member-info kind="property" type="string" default="'shop-api'"  >}}

{{< member-description >}}The path to the shop GraphQL API.{{< /member-description >}}

### adminApiPlayground

{{< member-info kind="property" type="boolean | any" default="false"  >}}

{{< member-description >}}The playground config to the admin GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).{{< /member-description >}}

### shopApiPlayground

{{< member-info kind="property" type="boolean | any" default="false"  >}}

{{< member-description >}}The playground config to the shop GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).{{< /member-description >}}

### adminApiDebug

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}The debug config to the admin GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).{{< /member-description >}}

### shopApiDebug

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}The debug config to the shop GraphQL API
[ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).{{< /member-description >}}

### shopListQueryLimit

{{< member-info kind="property" type="number" default="100"  >}}

{{< member-description >}}The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
this is the upper limit of the `take` input option.{{< /member-description >}}

### adminListQueryLimit

{{< member-info kind="property" type="number" default="1000"  >}}

{{< member-description >}}The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
this is the upper limit of the `take` input option.{{< /member-description >}}

### adminApiValidationRules

{{< member-info kind="property" type="Array&#60;(context: ValidationContext) =&#62; any&#62;" default="[]"  >}}

{{< member-description >}}Custom functions to use as additional validation rules when validating the schema for the admin GraphQL API
[ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).{{< /member-description >}}

### shopApiValidationRules

{{< member-info kind="property" type="Array&#60;(context: ValidationContext) =&#62; any&#62;" default="[]"  >}}

{{< member-description >}}Custom functions to use as additional validation rules when validating the schema for the shop GraphQL API
[ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).{{< /member-description >}}

### channelTokenKey

{{< member-info kind="property" type="string" default="'vendure-token'"  >}}

{{< member-description >}}The name of the property which contains the token of the
active channel. This property can be included either in
the request header or as a query string.{{< /member-description >}}

### cors

{{< member-info kind="property" type="boolean | CorsOptions" default="{ origin: true, credentials: true }"  >}}

{{< member-description >}}Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).{{< /member-description >}}

### middleware

{{< member-info kind="property" type="<a href='/typescript-api/common/middleware#middleware'>Middleware</a>[]" default="[]"  >}}

{{< member-description >}}Custom Express or NestJS middleware for the server.{{< /member-description >}}

### apolloServerPlugins

{{< member-info kind="property" type="PluginDefinition[]" default="[]"  >}}

{{< member-description >}}Custom [ApolloServerPlugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/) which
allow the extension of the Apollo Server, which is the underlying GraphQL server used by Vendure.

Apollo plugins can be used e.g. to perform custom data transformations on incoming operations or outgoing
data.{{< /member-description >}}

### introspection

{{< member-info kind="property" type="boolean" default="true"  since="1.5.0" >}}

{{< member-description >}}Controls whether introspection of the GraphQL APIs is enabled. For production, it is recommended to disable
introspection, since exposing your entire schema can allow an attacker to trivially learn all operations
and much more easily find any potentially exploitable queries.

**Note:** when introspection is disabled, tooling which relies on it for things like autocompletion
will not work.

*Example*

```TypeScript
{
  introspection: process.env.NODE_ENV !== 'production'
}
```{{< /member-description >}}


</div>
