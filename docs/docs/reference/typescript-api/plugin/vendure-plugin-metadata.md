---
title: "VendurePluginMetadata"
weight: 10
date: 2023-07-20T13:56:15.817Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VendurePluginMetadata

<GenerationInfo sourceFile="packages/core/src/plugin/vendure-plugin.ts" sourceLine="23" packageName="@vendure/core" />

Defines the metadata of a Vendure plugin. This interface is an superset of the [Nestjs ModuleMetadata](https://docs.nestjs.com/modules)
(which allows the definition of `imports`, `exports`, `providers` and `controllers`), which means
that any Nestjs Module is a valid Vendure plugin. In addition, the VendurePluginMetadata allows the definition of
extra properties specific to Vendure.

```ts title="Signature"
interface VendurePluginMetadata extends ModuleMetadata {
  configuration?: PluginConfigurationFn;
  shopApiExtensions?: APIExtensionDefinition;
  adminApiExtensions?: APIExtensionDefinition;
  entities?: Array<Type<any>> | (() => Array<Type<any>>);
  compatibility?: string;
}
```
Extends

 * ModuleMetadata



### configuration

<MemberInfo kind="property" type="<a href='/typescript-api/plugin/vendure-plugin-metadata#pluginconfigurationfn'>PluginConfigurationFn</a>"   />

A function which can modify the <a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a> object before the server bootstraps.
### shopApiExtensions

<MemberInfo kind="property" type="<a href='/typescript-api/plugin/vendure-plugin-metadata#apiextensiondefinition'>APIExtensionDefinition</a>"   />

The plugin may extend the default Vendure GraphQL shop api by providing extended
schema definitions and any required resolvers.
### adminApiExtensions

<MemberInfo kind="property" type="<a href='/typescript-api/plugin/vendure-plugin-metadata#apiextensiondefinition'>APIExtensionDefinition</a>"   />

The plugin may extend the default Vendure GraphQL admin api by providing extended
schema definitions and any required resolvers.
### entities

<MemberInfo kind="property" type="Array&#60;Type&#60;any&#62;&#62; | (() =&#62; Array&#60;Type&#60;any&#62;&#62;)"   />

The plugin may define custom [TypeORM database entities](https://typeorm.io/#/entities).
### compatibility

<MemberInfo kind="property" type="string"  since="2.0.0"  />

The plugin should define a valid [semver version string](https://www.npmjs.com/package/semver) to indicate which versions of
Vendure core it is compatible with. Attempting to use a plugin with an incompatible
version of Vendure will result in an error and the server will be unable to bootstrap.

If a plugin does not define this property, a message will be logged on bootstrap that the plugin is not
guaranteed to be compatible with the current version of Vendure.

To effectively disable this check for a plugin, you can use an overly-permissive string such as `>0.0.0`.

*Example*

```typescript
compatibility: '^2.0.0'
```


## APIExtensionDefinition

<GenerationInfo sourceFile="packages/core/src/plugin/vendure-plugin.ts" sourceLine="74" packageName="@vendure/core" />

An object which allows a plugin to extend the Vendure GraphQL API.

```ts title="Signature"
interface APIExtensionDefinition {
  schema?: DocumentNode | (() => DocumentNode | undefined);
  resolvers?: Array<Type<any>> | (() => Array<Type<any>>);
  scalars?: Record<string, GraphQLScalarType> | (() => Record<string, GraphQLScalarType>);
}
```

### schema

<MemberInfo kind="property" type="DocumentNode | (() =&#62; DocumentNode | undefined)"   />

Extensions to the schema.

*Example*

```TypeScript
const schema = gql`extend type SearchReindexResponse {
    timeTaken: Int!
    indexedItemCount: Int!
}`;
```
### resolvers

<MemberInfo kind="property" type="Array&#60;Type&#60;any&#62;&#62; | (() =&#62; Array&#60;Type&#60;any&#62;&#62;)"   />

An array of resolvers for the schema extensions. Should be defined as [Nestjs GraphQL resolver](https://docs.nestjs.com/graphql/resolvers-map)
classes, i.e. using the Nest `@Resolver()` decorator etc.
### scalars

<MemberInfo kind="property" type="Record&#60;string, GraphQLScalarType&#62; | (() =&#62; Record&#60;string, GraphQLScalarType&#62;)"  since="1.7.0"  />

A map of GraphQL scalar types which should correspond to any custom scalars defined in your schema.
Read more about defining custom scalars in the
[Apollo Server Custom Scalars docs](https://www.apollographql.com/docs/apollo-server/schema/custom-scalars)


## PluginConfigurationFn

<GenerationInfo sourceFile="packages/core/src/plugin/vendure-plugin.ts" sourceLine="112" packageName="@vendure/core" />

This method is called before the app bootstraps and should be used to perform any needed modifications to the <a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>.

```ts title="Signature"
type PluginConfigurationFn = (
    config: RuntimeVendureConfig,
) => RuntimeVendureConfig | Promise<RuntimeVendureConfig>
```
