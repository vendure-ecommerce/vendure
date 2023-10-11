---
title: "AdminUiExtension"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdminUiExtension

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="98" packageName="@vendure/ui-devkit" />

Defines extensions to the Admin UI application by specifying additional
Angular [NgModules](https://angular.io/guide/ngmodules) which are compiled
into the application.

See [Extending the Admin UI](/guides/extending-the-admin-ui/getting-started/) for
detailed instructions.

```ts title="Signature"
interface AdminUiExtension extends Partial<TranslationExtension>,
        Partial<StaticAssetExtension>,
        Partial<GlobalStylesExtension> {
    id?: string;
    extensionPath: string;
    ngModules?: Array<AdminUiExtensionSharedModule | AdminUiExtensionLazyModule>;
    providers?: string[];
    routes?: Array<{
        route: string;
        filePath: string;
    }>;
    pathAlias?: string;
    exclude?: string[];
}
```
* Extends: <code>Partial&#60;<a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#translationextension'>TranslationExtension</a>&#62;</code>, <code>Partial&#60;<a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#staticassetextension'>StaticAssetExtension</a>&#62;</code>, <code>Partial&#60;<a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#globalstylesextension'>GlobalStylesExtension</a>&#62;</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

An optional ID for the extension module. Only used internally for generating
import paths to your module. If not specified, a unique hash will be used as the id.
### extensionPath

<MemberInfo kind="property" type={`string`}   />

The path to the directory containing the extension module(s). The entire contents of this directory
will be copied into the Admin UI app, including all TypeScript source files, html templates,
scss style sheets etc.
### ngModules

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#adminuiextensionsharedmodule'>AdminUiExtensionSharedModule</a> | <a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#adminuiextensionlazymodule'>AdminUiExtensionLazyModule</a>&#62;`}   />

One or more Angular modules which extend the default Admin UI.
### providers

<MemberInfo kind="property" type={`string[]`}   />

Defines the paths to a file that exports an array of shared providers such as nav menu items, custom form inputs,
custom detail components, action bar items, custom history entry components.
### routes

<MemberInfo kind="property" type={`Array&#60;{         route: string;         filePath: string;     }&#62;`}   />

Defines routes that will be lazy-loaded at the `/extensions/` route. The filePath should point to a file
relative to the `extensionPath` which exports an array of Angular route definitions.
### pathAlias

<MemberInfo kind="property" type={`string`}   />

An optional alias for the module so it can be referenced by other UI extension modules.

By default, Angular modules declared in an AdminUiExtension do not have access to code outside the directory
defined by the `extensionPath`. A scenario in which that can be useful though is in a monorepo codebase where
a common NgModule is shared across different plugins, each defined in its own package. An example can be found
below - note that the main `tsconfig.json` also maps the target module but using a path relative to the project's
root folder. The UI module is not part of the main TypeScript build task as explained in
[Extending the Admin UI](https://www.vendure.io/docs/plugins/extending-the-admin-ui/) but having `paths`
properly configured helps with usual IDE code editing features such as code completion and quick navigation, as
well as linting.

*Example*

```ts title="packages/common-ui-module/src/ui/ui-shared.module.ts"
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

```ts title="packages/common-ui-module/src/index.ts"
import path from 'path';

import { AdminUiExtension } from '@vendure/ui-devkit/compiler';

export const uiExtensions: AdminUiExtension = {
  // highlight-next-line
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

```json title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // highlight-next-line
      "@common-ui-module/*": ["packages/common-ui-module/src/ui/*"]
    }
  }
}
```

```ts title="packages/sample-plugin/src/ui/ui-extension.module.ts"
import { NgModule } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';
// highlight-start
// the import below works both in the context of the custom Admin UI app as well as the main project
// '@common-ui-module' is the value of "pathAlias" and 'ui-shared.module' is the file we want to reference inside "extensionPath"
import { CommonSharedUiModule, CommonUiComponent } from '@common-ui-module/ui-shared.module';
// highlight-end

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
```
### exclude

<MemberInfo kind="property" type={`string[]`}   />

Optional array specifying filenames or [glob](https://github.com/isaacs/node-glob) patterns that should
be skipped when copying the directory defined by `extensionPath`.

*Example*

```ts
exclude: ['**/*.spec.ts']
```


</div>


## TranslationExtension

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="18" packageName="@vendure/ui-devkit" />

Defines extensions to the Admin UI translations. Can be used as a stand-alone extension definition which only adds translations
without adding new UI functionality, or as part of a full <a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#adminuiextension'>AdminUiExtension</a>.

```ts title="Signature"
interface TranslationExtension {
    translations: { [languageCode in LanguageCode]?: string };
}
```

<div className="members-wrapper">

### translations

<MemberInfo kind="property" type={`{ [languageCode in <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>]?: string }`}   />

Optional object defining any translation files for the Admin UI. The value should be an object with
the key as a 2-character [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes),
and the value being a [glob](https://github.com/isaacs/node-glob) for any relevant
translation files in JSON format.

*Example*

```ts
translations: {
  en: path.join(__dirname, 'translations/*.en.json'),
  de: path.join(__dirname, 'translations/*.de.json'),
}
```


</div>


## StaticAssetExtension

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="44" packageName="@vendure/ui-devkit" />

Defines extensions which copy static assets to the custom Admin UI application source asset directory.

```ts title="Signature"
interface StaticAssetExtension {
    staticAssets: StaticAssetDefinition[];
}
```

<div className="members-wrapper">

### staticAssets

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/ui-devkit/admin-ui-extension#staticassetdefinition'>StaticAssetDefinition</a>[]`}   />

Optional array of paths to static assets which will be copied over to the Admin UI app's `/static`
directory.


</div>


## GlobalStylesExtension

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="60" packageName="@vendure/ui-devkit" />

Defines extensions which add global styles to the custom Admin UI application.

```ts title="Signature"
interface GlobalStylesExtension {
    globalStyles: string[] | string;
}
```

<div className="members-wrapper">

### globalStyles

<MemberInfo kind="property" type={`string[] | string`}   />

Specifies a path (or array of paths) to global style files (css or Sass) which will be
incorporated into the Admin UI app global stylesheet.


</div>


## SassVariableOverridesExtension

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="76" packageName="@vendure/ui-devkit" />

Defines an extension which allows overriding Clarity Design System's Sass variables used in styles on the Admin UI.

```ts title="Signature"
interface SassVariableOverridesExtension {
    sassVariableOverrides: string;
}
```

<div className="members-wrapper">

### sassVariableOverrides

<MemberInfo kind="property" type={`string`}   />

Specifies a path to a Sass style file containing variable declarations, which will take precedence over
default values defined in Clarity.


</div>


## StaticAssetDefinition

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="251" packageName="@vendure/ui-devkit" />

A static asset can be provided as a path to the asset, or as an object containing a path and a new
name, which will cause the compiler to copy and then rename the asset.

```ts title="Signature"
type StaticAssetDefinition = string | { path: string; rename: string }
```


## AdminUiExtensionSharedModule

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="260" packageName="@vendure/ui-devkit" />

Configuration defining a single NgModule with which to extend the Admin UI.

```ts title="Signature"
interface AdminUiExtensionSharedModule {
    type: 'shared';
    ngModuleFileName: string;
    ngModuleName: string;
}
```

<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`'shared'`}   />

Shared modules are directly imported into the main AppModule of the Admin UI
and should be used to declare custom form components and define custom
navigation items.
### ngModuleFileName

<MemberInfo kind="property" type={`string`}   />

The name of the file containing the extension module class.
### ngModuleName

<MemberInfo kind="property" type={`string`}   />

The name of the extension module class.


</div>


## AdminUiExtensionLazyModule

<GenerationInfo sourceFile="packages/ui-devkit/src/compiler/types.ts" sourceLine="287" packageName="@vendure/ui-devkit" />

Configuration defining a single NgModule with which to extend the Admin UI.

```ts title="Signature"
interface AdminUiExtensionLazyModule {
    type: 'lazy';
    route: string;
    ngModuleFileName: string;
    ngModuleName: string;
}
```

<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`'lazy'`}   />

Lazy modules are lazy-loaded at the `/extensions/` route and should be used for
modules which define new views for the Admin UI.
### route

<MemberInfo kind="property" type={`string`}   />

The route specifies the route at which the module will be lazy-loaded. E.g. a value
of `'foo'` will cause the module to lazy-load when the `/extensions/foo` route
is activated.
### ngModuleFileName

<MemberInfo kind="property" type={`string`}   />

The name of the file containing the extension module class.
### ngModuleName

<MemberInfo kind="property" type={`string`}   />

The name of the extension module class.


</div>
