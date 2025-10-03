---
title: "DashboardPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardPlugin

<GenerationInfo sourceFile="packages/dashboard/plugin/dashboard.plugin.ts" sourceLine="101" packageName="@vendure/dashboard" />

This plugin serves the static files of the Vendure Dashboard and provides the
GraphQL extensions needed for the order metrics on the dashboard index page.

## Installation

`npm install @vendure/dashboard`

## Usage

First you need to set up compilation of the Dashboard, using the Vite configuration
described in the [Dashboard Getting Started Guide](/guides/extending-the-dashboard/getting-started/)

Once set up, you run `npx vite build` to build the production version of the dashboard app.

The built app files will be output to the location specified by `build.outDir` in your Vite
config file. This should then be passed to the `appDir` init option, as in the example below:

*Example*

```ts
import { DashboardPlugin } from '@vendure/dashboard/plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    DashboardPlugin.init({
      route: 'dashboard',
      appDir: './dist/dashboard',
    }),
  ],
};
```

## Metrics

This plugin defines a `metricSummary` query which is used by the Dashboard UI to
display the order metrics on the dashboard.

If you are building a stand-alone version of the Dashboard UI app, and therefore
don't need this plugin to serve the Dashboard UI, you can still use the
`metricSummary` query by adding the `DashboardPlugin` to the `plugins` array,
but without calling the `init()` method:

*Example*

```ts
import { DashboardPlugin } from '@vendure/dashboard-plugin';

const config: VendureConfig = {
  plugins: [
    DashboardPlugin, // <-- no call to .init()
  ],
  // ...
};
```

```ts title="Signature"
class DashboardPlugin implements NestModule {
    constructor(processContext: ProcessContext)
    init(options: DashboardPluginOptions) => Type<DashboardPlugin>;
    configure(consumer: MiddlewareConsumer) => ;
}
```
* Implements: <code>NestModule</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(processContext: <a href='/reference/typescript-api/common/process-context#processcontext'>ProcessContext</a>) => DashboardPlugin`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/dashboard-plugin/dashboard-plugin-options#dashboardpluginoptions'>DashboardPluginOptions</a>) => Type&#60;<a href='/reference/core-plugins/dashboard-plugin/#dashboardplugin'>DashboardPlugin</a>&#62;`}   />

Set the plugin options
### configure

<MemberInfo kind="method" type={`(consumer: MiddlewareConsumer) => `}   />




</div>
