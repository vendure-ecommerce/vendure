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

<GenerationInfo sourceFile="packages/dashboard/plugin/dashboard.plugin.ts" sourceLine="29" packageName="@vendure/dashboard" />

Configuration options for the <a href='/reference/core-plugins/dashboard-plugin/#dashboardplugin'>DashboardPlugin</a>.

```ts title="Signature"
interface DashboardPluginOptions {
    route: string;
    appDir: string;
    viteDevServerPort?: number;
}
```

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`string`} default={`'dashboard'`}   />

The route to the Dashboard UI.
### appDir

<MemberInfo kind="property" type={`string`}   />

The path to the dashboard UI app dist directory.
### viteDevServerPort

<MemberInfo kind="property" type={`number`} default={`5173`}   />

The port on which to check for a running Vite dev server.
If a Vite dev server is detected on this port, requests will be proxied to it
instead of serving static files from appDir.


</div>
