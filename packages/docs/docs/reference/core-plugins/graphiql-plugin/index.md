---
title: "GraphiqlPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## GraphiqlPlugin

<GenerationInfo sourceFile="packages/graphiql-plugin/src/plugin.ts" sourceLine="64" packageName="@vendure/graphiql-plugin" />

This plugin provides a GraphiQL UI for exploring and testing the Vendure GraphQL APIs.

It adds routes `/graphiql/admin` and `/graphiql/shop` which serve the GraphiQL interface
for the respective APIs.

## Installation

```ts
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    GraphiqlPlugin.init({
      route: 'graphiql', // Optional, defaults to 'graphiql'
    }),
  ],
};
```

## Custom API paths

By default, the plugin automatically reads the Admin API and Shop API paths from your Vendure configuration.

If you need to override these paths, you can specify them explicitly:

```typescript
GraphiQLPlugin.init({
    route: 'my-custom-route', // defaults to `graphiql`
});
```

## Query parameters

You can add the following query parameters to the GraphiQL URL:

- `?query=...` - Pre-populate the query editor with a GraphQL query.
- `?embeddedMode=true` - This renders the editor in embedded mode, which hides the header and
   the API switcher. This is useful for embedding GraphiQL in other applications such as documentation.
   In this mode, the editor also does not persist changes across reloads.

```ts title="Signature"
class GraphiqlPlugin implements NestModule {
    static options: Required<GraphiqlPluginOptions>;
    constructor(processContext: ProcessContext, configService: ConfigService, graphiQLService: GraphiQLService)
    init(options: GraphiqlPluginOptions = {}) => Type<GraphiqlPlugin>;
    configure(consumer: MiddlewareConsumer) => ;
}
```
* Implements: <code>NestModule</code>



<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`Required&#60;GraphiqlPluginOptions&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(processContext: <a href='/reference/typescript-api/common/process-context#processcontext'>ProcessContext</a>, configService: ConfigService, graphiQLService: GraphiQLService) => GraphiqlPlugin`}   />


### init

<MemberInfo kind="method" type={`(options: GraphiqlPluginOptions = {}) => Type&#60;<a href='/reference/core-plugins/graphiql-plugin/#graphiqlplugin'>GraphiqlPlugin</a>&#62;`}   />


### configure

<MemberInfo kind="method" type={`(consumer: MiddlewareConsumer) => `}   />




</div>
