---
title: "AdminUiAppConfig"
weight: 10
date: 2023-07-14T16:57:50.672Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdminUiAppConfig
<div class="symbol">


# AdminUiAppConfig

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="331" packageName="@vendure/common">}}

Configures the path to a custom-build of the Admin UI app.

## Signature

```TypeScript
interface AdminUiAppConfig {
  path: string;
  route?: string;
  compile?: () => Promise<void>;
}
```
## Members

### path

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The path to the compiled admin UI app files. If not specified, an internal
default build is used. This path should contain the `vendure-ui-config.json` file,
index.html, the compiled js bundles etc.{{< /member-description >}}

### route

{{< member-info kind="property" type="string" default="'admin'"  >}}

{{< member-description >}}Specifies the url route to the Admin UI app.{{< /member-description >}}

### compile

{{< member-info kind="property" type="() =&#62; Promise&#60;void&#62;"  >}}

{{< member-description >}}The function which will be invoked to start the app compilation process.{{< /member-description >}}


</div>
