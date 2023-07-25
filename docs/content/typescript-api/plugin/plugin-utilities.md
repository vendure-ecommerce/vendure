---
title: "Plugin Utilities"
weight: 10
date: 2023-07-14T16:57:50.208Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Plugin Utilities
<div class="symbol">


# createProxyHandler

{{< generation-info sourceFile="packages/core/src/plugin/plugin-utils.ts" sourceLine="37" packageName="@vendure/core">}}

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

## Signature

```TypeScript
function createProxyHandler(options: ProxyOptions): RequestHandler
```
## Parameters

### options

{{< member-info kind="parameter" type="<a href='/typescript-api/plugin/plugin-utilities#proxyoptions'>ProxyOptions</a>" >}}

</div>
<div class="symbol">


# ProxyOptions

{{< generation-info sourceFile="packages/core/src/plugin/plugin-utils.ts" sourceLine="76" packageName="@vendure/core">}}

Options to configure proxy middleware via <a href='/typescript-api/plugin/plugin-utilities#createproxyhandler'>createProxyHandler</a>.

## Signature

```TypeScript
interface ProxyOptions {
  label: string;
  route: string;
  port: number;
  hostname?: string;
  basePath?: string;
}
```
## Members

### label

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A human-readable label for the service which is being proxied. Used to
generate more informative logs.{{< /member-description >}}

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route of the Vendure server which will act as the proxy url.{{< /member-description >}}

### port

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The port on which the service being proxied is running.{{< /member-description >}}

### hostname

{{< member-info kind="property" type="string" default="'localhost'"  >}}

{{< member-description >}}The hostname of the server on which the service being proxied is running.{{< /member-description >}}

### basePath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}An optional base path on the proxied server.{{< /member-description >}}


</div>
