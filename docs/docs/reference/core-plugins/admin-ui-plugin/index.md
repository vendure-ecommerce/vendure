---
title: "AdminUiPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdminUiPlugin

<GenerationInfo sourceFile="packages/admin-ui-plugin/src/plugin.ts" sourceLine="129" packageName="@vendure/admin-ui-plugin" />

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

```ts
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';

const config: VendureConfig = {
  plugins: [
    AdminUiPlugin, // <-- no call to .init()
  ],
  // ...
};
```

```ts title="Signature"
class AdminUiPlugin implements NestModule {
    constructor(configService: ConfigService, processContext: ProcessContext)
    init(options: AdminUiPluginOptions) => Type<AdminUiPlugin>;
    configure(consumer: MiddlewareConsumer) => ;
}
```
* Implements: <code>NestModule</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService, processContext: <a href='/reference/typescript-api/common/process-context#processcontext'>ProcessContext</a>) => AdminUiPlugin`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/admin-ui-plugin/admin-ui-plugin-options#adminuipluginoptions'>AdminUiPluginOptions</a>) => Type&#60;<a href='/reference/core-plugins/admin-ui-plugin/#adminuiplugin'>AdminUiPlugin</a>&#62;`}   />

Set the plugin options
### configure

<MemberInfo kind="method" type={`(consumer: MiddlewareConsumer) => `}   />




</div>
