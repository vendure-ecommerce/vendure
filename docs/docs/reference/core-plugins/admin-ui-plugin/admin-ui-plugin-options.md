---
title: "AdminUiPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdminUiPluginOptions

<GenerationInfo sourceFile="packages/admin-ui-plugin/src/plugin.ts" sourceLine="43" packageName="@vendure/admin-ui-plugin" />

Configuration options for the <a href='/reference/core-plugins/admin-ui-plugin/#adminuiplugin'>AdminUiPlugin</a>.

```ts title="Signature"
interface AdminUiPluginOptions {
    route: string;
    port: number;
    hostname?: string;
    app?: AdminUiAppConfig | AdminUiAppDevModeConfig;
    adminUiConfig?: Partial<AdminUiConfig>;
}
```

<div className="members-wrapper">

### route

<MemberInfo kind="property" type={`string`}   />

The route to the Admin UI.

Note: If you are using the `compileUiExtensions` function to compile a custom version of the Admin UI, then
the route should match the `baseHref` option passed to that function. The default value of `baseHref` is `/admin/`,
so it only needs to be changed if you set this `route` option to something other than `"admin"`.
### port

<MemberInfo kind="property" type={`number`}   />

The port on which the server will listen. This port will be proxied by the AdminUiPlugin to the same port that
the Vendure server is running on.
### hostname

<MemberInfo kind="property" type={`string`} default={`'localhost'`}   />

The hostname of the server serving the static admin ui files.
### app

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/admin-ui/admin-ui-app-config#adminuiappconfig'>AdminUiAppConfig</a> | <a href='/reference/typescript-api/common/admin-ui/admin-ui-app-dev-mode-config#adminuiappdevmodeconfig'>AdminUiAppDevModeConfig</a>`}   />

By default, the AdminUiPlugin comes bundles with a pre-built version of the
Admin UI. This option can be used to override this default build with a different
version, e.g. one pre-compiled with one or more ui extensions.
### adminUiConfig

<MemberInfo kind="property" type={`Partial&#60;<a href='/reference/typescript-api/common/admin-ui/admin-ui-config#adminuiconfig'>AdminUiConfig</a>&#62;`}   />

Allows the contents of the `vendure-ui-config.json` file to be set, e.g.
for specifying the Vendure GraphQL API host, available UI languages, etc.


</div>
