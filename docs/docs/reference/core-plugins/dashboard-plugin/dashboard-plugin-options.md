---
title: "DashboardPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardPluginOptions

<GenerationInfo sourceFile="packages/dashboard/plugin/dashboard.plugin.ts" sourceLine="27" packageName="@vendure/dashboard" />

Configuration options for the <a href='/reference/core-plugins/dashboard-plugin/#dashboardplugin'>DashboardPlugin</a>.

```ts title="Signature"
interface DashboardPluginOptions {
    route: string;
    appDir: string;
}
```

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`string`} default={`'dashboard'`}   />

The route to the Dashboard UI.
### appDir

<MemberInfo kind="property" type={`string`}   />

The path to the dashboard UI app dist directory. By default, the built-in dashboard UI
will be served. This can be overridden with a custom build of the dashboard.


</div>
