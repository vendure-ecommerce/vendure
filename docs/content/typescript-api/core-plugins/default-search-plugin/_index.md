---
title: "DefaultSearchPlugin"
weight: 10
date: 2023-07-14T16:57:50.203Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultSearchPlugin
<div class="symbol">


# DefaultSearchPlugin

{{< generation-info sourceFile="packages/core/src/plugin/default-search-plugin/default-search-plugin.ts" sourceLine="69" packageName="@vendure/core">}}

The DefaultSearchPlugin provides a full-text Product search based on the full-text searching capabilities of the
underlying database.

The DefaultSearchPlugin is bundled with the `@vendure/core` package. If you are not using an alternative search
plugin, then make sure this one is used, otherwise you will not be able to search products via the
[`search` query](/docs/graphql-api/shop/queries#search).

{{% alert "warning" %}}
Note that the quality of the fulltext search capabilities varies depending on the underlying database being used. For example,
the MySQL & Postgres implementations will typically yield better results than the SQLite implementation.
{{% /alert %}}

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

## Signature

```TypeScript
class DefaultSearchPlugin implements OnApplicationBootstrap, OnApplicationShutdown {
  static static options: DefaultSearchPluginInitOptions = {};
  static init(options: DefaultSearchPluginInitOptions) => Type<DefaultSearchPlugin>;
}
```
## Implements

 * OnApplicationBootstrap
 * OnApplicationShutdown


## Members

### options

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/default-search-plugin/default-search-plugin-init-options#defaultsearchplugininitoptions'>DefaultSearchPluginInitOptions</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/core-plugins/default-search-plugin/default-search-plugin-init-options#defaultsearchplugininitoptions'>DefaultSearchPluginInitOptions</a>) => Type&#60;<a href='/typescript-api/core-plugins/default-search-plugin/#defaultsearchplugin'>DefaultSearchPlugin</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
