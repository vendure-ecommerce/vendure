---
title: "AdminUiPlugin"
weight: 10
date: 2023-07-14T16:57:50.678Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdminUiPlugin
<div class="symbol">


# AdminUiPlugin

{{< generation-info sourceFile="packages/admin-ui-plugin/src/plugin.ts" sourceLine="125" packageName="@vendure/admin-ui-plugin">}}

This plugin starts a static server for the Admin UI app, and proxies it via the `/admin/` path of the main Vendure server.

The Admin UI allows you to administer all aspects of your store, from inventory management to order tracking. It is the tool used by
store administrators on a day-to-day basis for the management of the store.

## Installation

`yarn add @vendure/admin-ui-plugin`

or

`npm install @vendure/admin-ui-plugin`

*Example*

```ts
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    AdminUiPlugin.init({ port: 3002 }),
  ],
};
```

## Metrics

This plugin also defines a `metricSummary` query which is used by the Admin UI to display the order metrics on the dashboard.

If you are building a stand-alone version of the Admin UI app, and therefore don't need this plugin to server the Admin UI,
you can still use the `metricSummary` query by adding the `AdminUiPlugin` to the `plugins` array, but without calling the `init()` method:

*Example*

```TypeScript
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';

const config: VendureConfig = {
  plugins: [
    AdminUiPlugin, // <-- no call to .init()
  ],
  // ...
};
```

## Signature

```TypeScript
class AdminUiPlugin implements NestModule {
  constructor(configService: ConfigService, processContext: ProcessContext)
  static init(options: AdminUiPluginOptions) => Type<AdminUiPlugin>;
  async configure(consumer: MiddlewareConsumer) => ;
}
```
## Implements

 * NestModule


## Members

### constructor

{{< member-info kind="method" type="(configService: ConfigService, processContext: <a href='/typescript-api/common/process-context#processcontext'>ProcessContext</a>) => AdminUiPlugin"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/core-plugins/admin-ui-plugin/admin-ui-plugin-options#adminuipluginoptions'>AdminUiPluginOptions</a>) => Type&#60;<a href='/typescript-api/core-plugins/admin-ui-plugin/#adminuiplugin'>AdminUiPlugin</a>&#62;"  >}}

{{< member-description >}}Set the plugin options{{< /member-description >}}

### configure

{{< member-info kind="method" type="(consumer: MiddlewareConsumer) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
