---
title: "AdminUiPluginOptions"
weight: 10
date: 2023-07-14T16:57:50.676Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdminUiPluginOptions
<div class="symbol">


# AdminUiPluginOptions

{{< generation-info sourceFile="packages/admin-ui-plugin/src/plugin.ts" sourceLine="39" packageName="@vendure/admin-ui-plugin">}}

Configuration options for the <a href='/typescript-api/core-plugins/admin-ui-plugin/#adminuiplugin'>AdminUiPlugin</a>.

## Signature

```TypeScript
interface AdminUiPluginOptions {
  route: string;
  port: number;
  hostname?: string;
  app?: AdminUiAppConfig | AdminUiAppDevModeConfig;
  adminUiConfig?: Partial<AdminUiConfig>;
}
```
## Members

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route to the Admin UI.

Note: If you are using the {@link compileUiExtensions} function to compile a custom version of the Admin UI, then
the route should match the `baseHref` option passed to that function. The default value of `baseHref` is `/admin/`,
so it only needs to be changed if you set this `route` option to something other than `"admin"`.{{< /member-description >}}

### port

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The port on which the server will listen. This port will be proxied by the AdminUiPlugin to the same port that
the Vendure server is running on.{{< /member-description >}}

### hostname

{{< member-info kind="property" type="string" default="'localhost'"  >}}

{{< member-description >}}The hostname of the server serving the static admin ui files.{{< /member-description >}}

### app

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/admin-ui-plugin/admin-ui-app-config#adminuiappconfig'>AdminUiAppConfig</a> | <a href='/typescript-api/core-plugins/admin-ui-plugin/admin-ui-app-dev-mode-config#adminuiappdevmodeconfig'>AdminUiAppDevModeConfig</a>"  >}}

{{< member-description >}}By default, the AdminUiPlugin comes bundles with a pre-built version of the
Admin UI. This option can be used to override this default build with a different
version, e.g. one pre-compiled with one or more ui extensions.{{< /member-description >}}

### adminUiConfig

{{< member-info kind="property" type="Partial&#60;<a href='/typescript-api/core-plugins/admin-ui-plugin/admin-ui-config#adminuiconfig'>AdminUiConfig</a>&#62;"  >}}

{{< member-description >}}Allows the contents of the `vendure-ui-config.json` file to be set, e.g.
for specifying the Vendure GraphQL API host, available UI languages, etc.{{< /member-description >}}


</div>
