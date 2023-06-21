---
title: "Helpers"
weight: 10
date: 2023-06-21T06:23:42.809Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# helpers
<div class="symbol">


# setBranding

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/helpers.ts" sourceLine="24" packageName="@vendure/ui-devkit">}}

A helper function to simplify the process of setting custom branding images.

*Example*

```TypeScript
compileUiExtensions({
  outputPath: path.join(__dirname, '../admin-ui'),
  extensions: [
    setBranding({
      smallLogoPath: path.join(__dirname, 'images/my-logo-sm.png'),
      largeLogoPath: path.join(__dirname, 'images/my-logo-lg.png'),
      faviconPath: path.join(__dirname, 'images/my-favicon.ico'),
    }),
  ],
});
```

## Signature

```TypeScript
function setBranding(options: BrandingOptions): StaticAssetExtension
```
## Parameters

### options

{{< member-info kind="parameter" type="BrandingOptions" >}}

</div>
