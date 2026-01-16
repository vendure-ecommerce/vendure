---
title: "Helpers"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## setBranding

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/helpers.ts" sourceLine="26" packageName="@vendure/ui-devkit" />

A helper function to simplify the process of setting custom branding images.

*Example*

```ts
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

```ts title="Signature"
function setBranding(options: BrandingOptions): StaticAssetExtension
```
Parameters

### options

<MemberInfo kind="parameter" type={`BrandingOptions`} />

