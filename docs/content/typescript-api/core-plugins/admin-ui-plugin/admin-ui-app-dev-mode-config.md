---
title: "AdminUiAppDevModeConfig"
weight: 10
date: 2023-07-14T16:57:50.674Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdminUiAppDevModeConfig
<div class="symbol">


# AdminUiAppDevModeConfig

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="359" packageName="@vendure/common">}}

Information about the Admin UI app dev server.

## Signature

```TypeScript
interface AdminUiAppDevModeConfig {
  sourcePath: string;
  port: number;
  route?: string;
  compile: () => Promise<void>;
}
```
## Members

### sourcePath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The path to the uncompiled UI app source files. This path should contain the `vendure-ui-config.json` file.{{< /member-description >}}

### port

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The port on which the dev server is listening. Overrides the value set by `AdminUiOptions.port`.{{< /member-description >}}

### route

{{< member-info kind="property" type="string" default="'admin'"  >}}

{{< member-description >}}Specifies the url route to the Admin UI app.{{< /member-description >}}

### compile

{{< member-info kind="property" type="() =&#62; Promise&#60;void&#62;"  >}}

{{< member-description >}}The function which will be invoked to start the app compilation process.{{< /member-description >}}


</div>
