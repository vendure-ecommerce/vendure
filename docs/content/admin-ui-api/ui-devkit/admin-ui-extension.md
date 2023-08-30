---
title: "AdminUiExtension"
weight: 10
date: 2023-07-14T16:57:51.350Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdminUiExtension
<div class="symbol">


# AdminUiExtension

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="98" packageName="@vendure/ui-devkit">}}

Defines extensions to the Admin UI application by specifying additional
Angular [NgModules](https://angular.io/guide/ngmodules) which are compiled
into the application.

See [Extending the Admin UI](/docs/plugins/extending-the-admin-ui/) for
detailed instructions.

## Signature

```TypeScript
interface AdminUiExtension extends Partial<TranslationExtension>,
        Partial<StaticAssetExtension>,
        Partial<GlobalStylesExtension> {
  id?: string;
  extensionPath: string;
  ngModules: Array<AdminUiExtensionSharedModule | AdminUiExtensionLazyModule>;
  pathAlias?: string;
  exclude?: string[];
}
```
## Extends

 * Partial&#60;<a href='/admin-ui-api/ui-devkit/admin-ui-extension#translationextension'>TranslationExtension</a>&#62;
 * Partial&#60;<a href='/admin-ui-api/ui-devkit/admin-ui-extension#staticassetextension'>StaticAssetExtension</a>&#62;
 * Partial&#60;<a href='/admin-ui-api/ui-devkit/admin-ui-extension#globalstylesextension'>GlobalStylesExtension</a>&#62;


## Members

### id

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}An optional ID for the extension module. Only used internally for generating
import paths to your module. If not specified, a unique hash will be used as the id.{{< /member-description >}}

### extensionPath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The path to the directory containing the extension module(s). The entire contents of this directory
will be copied into the Admin UI app, including all TypeScript source files, html templates,
scss style sheets etc.{{< /member-description >}}

### ngModules

{{< member-info kind="property" type="Array&#60;<a href='/admin-ui-api/ui-devkit/admin-ui-extension#adminuiextensionsharedmodule'>AdminUiExtensionSharedModule</a> | <a href='/admin-ui-api/ui-devkit/admin-ui-extension#adminuiextensionlazymodule'>AdminUiExtensionLazyModule</a>&#62;"  >}}

{{< member-description >}}One or more Angular modules which extend the default Admin UI.{{< /member-description >}}

### pathAlias

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}An optional alias for the module so it can be referenced by other UI extension modules.

By default, Angular modules declared in an AdminUiExtension do not have access to code outside the directory
defined by the `extensionPath`. A scenario in which that can be useful though is in a monorepo codebase where
a common NgModule is shared across different plugins, each defined in its own package. An example can be found
below - note that the main `tsconfig.json` also maps the target module but using a path relative to the project's
root folder. The UI module is not part of the main TypeScript build task as explained in
[Extending the Admin UI](https://www.vendure.io/docs/plugins/extending-the-admin-ui/) but having `paths`
properly configured helps with usual IDE code editing features such as code completion and quick navigation, as
well as linting.

*Example*

```ts
// packages/common-ui-module/src/ui/ui-shared.module.ts
import { NgModule } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';
import { CommonUiComponent } from './components/common-ui/common-ui.component';

export { CommonUiComponent };

@NgModule({
 imports: [SharedModule],
 exports: [CommonUiComponent],
 declarations: [CommonUiComponent],
})
export class CommonSharedUiModule {}
```

```ts
// packages/common-ui-module/src/index.ts
import path from 'path';

import { AdminUiExtension } from '@vendure/ui-devkit/compiler';

export const uiExtensions: AdminUiExtension = {
  pathAlias: '@common-ui-module',     // this is the important part
  extensionPath: path.join(__dirname, 'ui'),
  ngModules: [
    {
      type: 'shared' as const,
      ngModuleFileName: 'ui-shared.module.ts',
      ngModuleName: 'CommonSharedUiModule',
    },
  ],
};
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@common-ui-module/*": ["packages/common-ui-module/src/ui/*"]
    }
  }
}
```

```ts
// packages/sample-plugin/src/ui/ui-extension.module.ts
import { NgModule } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';
// the import below works both in the context of the custom Admin UI app as well as the main project
// '@common-ui-module' is the value of "pathAlias" and 'ui-shared.module' is the file we want to reference inside "extensionPath"
import { CommonSharedUiModule, CommonUiComponent } from '@common-ui-module/ui-shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonSharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CommonUiComponent,
      },
    ]),
  ],
})
export class SampleUiExtensionModule {}
```{{< /member-description >}}

### exclude

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}Optional array specifying filenames or [glob](https://github.com/isaacs/node-glob) patterns that should
be skipped when copying the directory defined by `extensionPath`.

*Example*

```ts
exclude: ['**/*.spec.ts']
```{{< /member-description >}}


</div>
<div class="symbol">


# TranslationExtension

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="18" packageName="@vendure/ui-devkit">}}

Defines extensions to the Admin UI translations. Can be used as a stand-alone extension definition which only adds translations
without adding new UI functionality, or as part of a full <a href='/admin-ui-api/ui-devkit/admin-ui-extension#adminuiextension'>AdminUiExtension</a>.

## Signature

```TypeScript
interface TranslationExtension {
  translations: { [languageCode in LanguageCode]?: string };
}
```
## Members

### translations

{{< member-info kind="property" type="{ [languageCode in <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>]?: string }"  >}}

{{< member-description >}}Optional object defining any translation files for the Admin UI. The value should be an object with
the key as a 2-character [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes),
and the value being a [glob](https://github.com/isaacs/node-glob) for any relevant
translation files in JSON format.

*Example*

```TypeScript
translations: {
  en: path.join(__dirname, 'translations/*.en.json'),
  de: path.join(__dirname, 'translations/*.de.json'),
}
```{{< /member-description >}}


</div>
<div class="symbol">


# StaticAssetExtension

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="44" packageName="@vendure/ui-devkit">}}

Defines extensions which copy static assets to the custom Admin UI application source asset directory.

## Signature

```TypeScript
interface StaticAssetExtension {
  staticAssets: StaticAssetDefinition[];
}
```
## Members

### staticAssets

{{< member-info kind="property" type="<a href='/admin-ui-api/ui-devkit/admin-ui-extension#staticassetdefinition'>StaticAssetDefinition</a>[]"  >}}

{{< member-description >}}Optional array of paths to static assets which will be copied over to the Admin UI app's `/static`
directory.{{< /member-description >}}


</div>
<div class="symbol">


# GlobalStylesExtension

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="60" packageName="@vendure/ui-devkit">}}

Defines extensions which add global styles to the custom Admin UI application.

## Signature

```TypeScript
interface GlobalStylesExtension {
  globalStyles: string[] | string;
}
```
## Members

### globalStyles

{{< member-info kind="property" type="string[] | string"  >}}

{{< member-description >}}Specifies a path (or array of paths) to global style files (css or Sass) which will be
incorporated into the Admin UI app global stylesheet.{{< /member-description >}}


</div>
<div class="symbol">


# SassVariableOverridesExtension

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="76" packageName="@vendure/ui-devkit">}}

Defines an extension which allows overriding Clarity Design System's Sass variables used in styles on the Admin UI.

## Signature

```TypeScript
interface SassVariableOverridesExtension {
  sassVariableOverrides: string;
}
```
## Members

### sassVariableOverrides

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}Specifies a path to a Sass style file containing variable declarations, which will take precedence over
default values defined in Clarity.{{< /member-description >}}


</div>
<div class="symbol">


# StaticAssetDefinition

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="231" packageName="@vendure/ui-devkit">}}

A static asset can be provided as a path to the asset, or as an object containing a path and a new
name, which will cause the compiler to copy and then rename the asset.

## Signature

```TypeScript
type StaticAssetDefinition = string | { path: string; rename: string }
```
</div>
<div class="symbol">


# AdminUiExtensionSharedModule

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="240" packageName="@vendure/ui-devkit">}}

Configuration defining a single NgModule with which to extend the Admin UI.

## Signature

```TypeScript
interface AdminUiExtensionSharedModule {
  type: 'shared';
  ngModuleFileName: string;
  ngModuleName: string;
}
```
## Members

### type

{{< member-info kind="property" type="'shared'"  >}}

{{< member-description >}}Shared modules are directly imported into the main AppModule of the Admin UI
and should be used to declare custom form components and define custom
navigation items.{{< /member-description >}}

### ngModuleFileName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the file containing the extension module class.{{< /member-description >}}

### ngModuleName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the extension module class.{{< /member-description >}}


</div>
<div class="symbol">


# AdminUiExtensionLazyModule

{{< generation-info sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="267" packageName="@vendure/ui-devkit">}}

Configuration defining a single NgModule with which to extend the Admin UI.

## Signature

```TypeScript
interface AdminUiExtensionLazyModule {
  type: 'lazy';
  route: string;
  ngModuleFileName: string;
  ngModuleName: string;
}
```
## Members

### type

{{< member-info kind="property" type="'lazy'"  >}}

{{< member-description >}}Lazy modules are lazy-loaded at the `/extensions/` route and should be used for
modules which define new views for the Admin UI.{{< /member-description >}}

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route specifies the route at which the module will be lazy-loaded. E.g. a value
of `'foo'` will cause the module to lazy-load when the `/extensions/foo` route
is activated.{{< /member-description >}}

### ngModuleFileName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the file containing the extension module class.{{< /member-description >}}

### ngModuleName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the extension module class.{{< /member-description >}}


</div>
