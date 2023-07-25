---
title: "UiExtensionCompilerOptions"
weight: 10
date: 2023-07-14T16:57:51.362Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# UiExtensionCompilerOptions
<div class="symbol">


# UiExtensionCompilerOptions

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="307" packageName="@vendure/ui-devkit">}}

Options to configure how the Admin UI should be compiled.

## Signature

```TypeScript
interface UiExtensionCompilerOptions {
  outputPath: string;
  extensions: Extension[];
  devMode?: boolean;
  baseHref?: string;
  watchPort?: number;
  command?: 'yarn' | 'npm';
  additionalProcessArguments?: UiExtensionCompilerProcessArgument[];
}
```
## Members

### outputPath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The directory into which the sources for the extended Admin UI will be copied.{{< /member-description >}}

### extensions

{{< member-info kind="property" type="Extension[]"  >}}

{{< member-description >}}An array of objects which configure Angular modules and/or
translations with which to extend the Admin UI.{{< /member-description >}}

### devMode

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}Set to `true` in order to compile the Admin UI in development mode (using the Angular CLI
[ng serve](https://angular.io/cli/serve) command). When in dev mode, any changes to
UI extension files will be watched and trigger a rebuild of the Admin UI with live
reloading.{{< /member-description >}}

### baseHref

{{< member-info kind="property" type="string" default="'/admin/'"  >}}

{{< member-description >}}Allows the baseHref of the compiled Admin UI app to be set. This determines the prefix
of the app, for example with the default value of `'/admin/'`, the Admin UI app
will be configured to be served from `http://<host>/admin/`.

Note: if you are using this in conjunction with the <a href='/typescript-api/core-plugins/admin-ui-plugin/#adminuiplugin'>AdminUiPlugin</a> then you should
also set the `route` option to match this value.

*Example*

```TypeScript
AdminUiPlugin.init({
  route: 'my-route',
  port: 5001,
  app: compileUiExtensions({
    baseHref: '/my-route/',
    outputPath: path.join(__dirname, './custom-admin-ui'),
    extensions: [],
    devMode: true,
  }),
}),
```{{< /member-description >}}

### watchPort

{{< member-info kind="property" type="number" default="4200 | undefined"  >}}

{{< member-description >}}In watch mode, allows the port of the dev server to be specified. Defaults to the Angular CLI default
of `4200`.{{< /member-description >}}

### command

{{< member-info kind="property" type="'yarn' | 'npm'"  since="1.5.0" >}}

{{< member-description >}}Internally, the Angular CLI will be invoked as an npm script. By default, the compiler will use Yarn
to run the script if it is detected, otherwise it will use npm. This setting allows you to explicitly
set which command to use, rather than relying on the default behavior.{{< /member-description >}}

### additionalProcessArguments

{{< member-info kind="property" type="<a href='/admin-ui-api/ui-devkit/ui-extension-compiler-process-argument#uiextensioncompilerprocessargument'>UiExtensionCompilerProcessArgument</a>[]" default="undefined"  since="1.5.0" >}}

{{< member-description >}}Additional command-line arguments which will get passed to the [ng build](https://angular.io/cli/build)
command (or [ng serve](https://angular.io/cli/serve) if `devMode = true`).

*Example*

['--disable-host-check'] // to disable host check{{< /member-description >}}


</div>
