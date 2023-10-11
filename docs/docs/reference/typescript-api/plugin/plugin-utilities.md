---
title: "Plugin Utilities"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## createProxyHandler

<GenerationInfo sourceFile="packages/core/src/plugin/plugin-utils.ts" sourceLine="37" packageName="@vendure/core" />

Creates a proxy middleware which proxies the given route to the given port.
Useful for plugins which start their own servers but should be accessible
via the main Vendure url.

*Example*

```ts
// Example usage in the `configuration` method of a VendurePlugin.
// Imagine that we have started a Node server on port 5678
// running some service which we want to access via the `/my-plugin/`
// route of the main Vendure server.
@VendurePlugin({
  configuration: (config: Required<VendureConfig>) => {
      config.apiOptions.middleware.push({
          handler: createProxyHandler({
              label: 'Admin UI',
              route: 'my-plugin',
              port: 5678,
          }),
          route: 'my-plugin',
      });
      return config;
  }
})
export class MyPlugin {}
```

```ts title="Signature"
function createProxyHandler(options: ProxyOptions): RequestHandler
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/plugin/plugin-utilities#proxyoptions'>ProxyOptions</a>`} />



## ProxyOptions

<GenerationInfo sourceFile="packages/core/src/plugin/plugin-utils.ts" sourceLine="76" packageName="@vendure/core" />

Options to configure proxy middleware via <a href='/reference/typescript-api/plugin/plugin-utilities#createproxyhandler'>createProxyHandler</a>.

```ts title="Signature"
interface ProxyOptions {
    label: string;
    route: string;
    port: number;
    hostname?: string;
    basePath?: string;
}
```

<div className="members-wrapper">

### label

<MemberInfo kind="property" type={`string`}   />

A human-readable label for the service which is being proxied. Used to
generate more informative logs.
### route

<MemberInfo kind="property" type={`string`}   />

The route of the Vendure server which will act as the proxy url.
### port

<MemberInfo kind="property" type={`number`}   />

The port on which the service being proxied is running.
### hostname

<MemberInfo kind="property" type={`string`} default="'localhost'"   />

The hostname of the server on which the service being proxied is running.
### basePath

<MemberInfo kind="property" type={`string`}   />

An optional base path on the proxied server.


</div>
