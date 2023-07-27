---
title: "Helpers"
weight: 10
date: 2023-07-14T16:57:51.349Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# helpers
<div class="symbol">


# setBranding

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/helpers.ts" sourceLine="26" packageName="@vendure/ui-devkit">}}

A helper function to simplify the process of setting custom branding images.

*Example*

```TypeScript
compileUiExtensions({
  outputPath: path.join(__dirname, '../admin-ui'),
  extensions: [
    setBranding({
      // This is used as the branding in the top-left above the navigation
      smallLogoPath: path.join(__dirname, 'images/my-logo-sm.png'),
      // This is used on the login page
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
