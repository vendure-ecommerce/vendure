---
title: "DefaultSearchPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultSearchPlugin

<GenerationInfo sourceFile="packages/core/src/plugin/default-search-plugin/default-search-plugin.ts" sourceLine="69" packageName="@vendure/core" />

The DefaultSearchPlugin provides a full-text Product search based on the full-text searching capabilities of the
underlying database.

The DefaultSearchPlugin is bundled with the `@vendure/core` package. If you are not using an alternative search
plugin, then make sure this one is used, otherwise you will not be able to search products via the
[`search` query](/reference/graphql-api/shop/queries#search).

:::caution
Note that the quality of the fulltext search capabilities varies depending on the underlying database being used. For example,
the MySQL & Postgres implementations will typically yield better results than the SQLite implementation.
:::

*Example*

```ts
import { DefaultSearchPlugin, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    DefaultSearchPlugin.init({
      indexStockStatus: true,
      bufferUpdates: true,
    }),
  ],
};
```

```ts title="Signature"
class DefaultSearchPlugin implements OnApplicationBootstrap, OnApplicationShutdown {
    static options: DefaultSearchPluginInitOptions = {};
    init(options: DefaultSearchPluginInitOptions) => Type<DefaultSearchPlugin>;
}
```
* Implements: <code>OnApplicationBootstrap</code>, <code>OnApplicationShutdown</code>



<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/default-search-plugin/default-search-plugin-init-options#defaultsearchplugininitoptions'>DefaultSearchPluginInitOptions</a>`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/default-search-plugin/default-search-plugin-init-options#defaultsearchplugininitoptions'>DefaultSearchPluginInitOptions</a>) => Type&#60;<a href='/reference/typescript-api/default-search-plugin/#defaultsearchplugin'>DefaultSearchPlugin</a>&#62;`}   />




</div>
