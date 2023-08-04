---
title: 'Extending the Admin UI'
weight: 5
---

# Extending the Admin UI

When creating a plugin, you may wish to extend the Admin UI in order to expose a graphical interface to the plugin's functionality.

This is possible by defining [AdminUiExtensions]({{< ref "admin-ui-extension" >}}).

{{< alert "primary" >}}
For a complete working example of a Vendure plugin that extends the Admin UI, see the [real-world-vendure Reviews plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/reviews)
{{< /alert >}}

## How It Works

A UI extension is an [Angular module](https://angular.io/guide/ngmodules) that gets compiled into the Admin UI application bundle by the [`compileUiExtensions`]({{< relref "compile-ui-extensions" >}}) function exported by the `@vendure/ui-devkit` package. Internally, the ui-devkit package makes use of the Angular CLI to compile an optimized set of JavaScript bundles containing your extensions.

## Use Your Favourite Framework

The Vendure Admin UI is built with Angular, and writing UI extensions in Angular is seamless and powerful. But if you are not familiar with Angular, that's no problem! You can write UI extensions using **React**, **Vue**, or **any other** web technology of choice!

* [UI extensions in Angular]({{< relref "using-angular" >}})
* [UI extensions in other frameworks]({{< relref "using-other-frameworks" >}})

## Lazy vs Shared Modules

Angular uses the concept of modules ([NgModules](https://angular.io/guide/ngmodules)) for organizing related code. These modules can be lazily loaded, which means that the code is not loaded when the app starts, but only later once that code is required. This keeps the main bundle small and improves performance.

When creating your UI extensions, you can set your module to be either `lazy` or `shared`. Shared modules are loaded _eagerly_, i.e. their code is bundled up with the main app and loaded as soon as the app loads.

As a rule, modules defining new routes should be lazily loaded (so that the code is only loaded once that route is activated), and modules defining [new navigations items]({{< relref "modifying-navigation-items" >}}) and [custom form input]({{< relref "custom-form-inputs" >}}) should be set to `shared`.

## Dev mode

When you are developing your Admin UI extension, you can set the `devMode` option to `true` which will compile the Admin UI app in development mode, and recompile and auto-refresh the browser on any changes to your extension source files.

```TypeScript
// vendure-config.ts
plugins: [
  AdminUiPlugin.init({
    port: 3002,
    app: compileUiExtensions({
      outputPath: path.join(__dirname, '../admin-ui'),
      extensions: [{
        // ...
      }],
      devMode: true,
    }),
  }),
],
```

## Compiling as a deployment step

Although the examples so far all use the `compileUiExtensions` function in conjunction with the AdminUiPlugin, it is also possible to use it on its own:

```TypeScript
// compile-admin-ui.ts
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import * as path from 'path';

compileUiExtensions({
    outputPath: path.join(__dirname, '../admin-ui'),
    extensions: [/* ... */],
}).compile?.().then(() => {
    process.exit(0);
});

```

This can then be run from the command line:

```bash
yarn ts-node compile-admin-ui.ts
```

Once complete, the production-ready app bundle will be output to `admin-ui/dist`. This method is suitable for a production setup, so that the Admin UI can be compiled ahead-of-time as part of your deployment process. This ensures that your Vendure server starts up as quickly as possible. In this case, you can pass the path of the compiled app to the AdminUiPlugin:

```TypeScript
// project/vendure-config.ts
plugins: [
  AdminUiPlugin.init({
    port: 3002,
    app: {
      path: 'admin-ui/dist'
    }
  }),
],
```

{{< alert warning >}}
**Note:** the TypeScript source files of your UI extensions **must not** be compiled by your regular TypeScript build task. This is because they will instead be compiled by the Angular compiler when you run `compileUiExtensions()`. You can exclude them in your main `tsconfig.json` by adding a line to the "exclude" array:
```json
{
  "exclude": [
    "src/plugins/**/ui/*"
  ]
}
```
{{< /alert >}}
{{< alert warning >}}
**Also note:** When you use compileUiExtensions to compile the Angular App, a new directory will be created to host the compiled Admin-UI app. The name and location of the app is specified by the "outputPath" which is set in the compileUiExtensions options object. Make sure to **exlcude** the admin-ui directory from typescript's transpilation since code there is already transpiled.
```json
{
  "exclude": [
    "node_modules",
    "migration.ts",
    "admin-ui" // <-- add this
  ],
}
```
{{< /alert >}}

{{< alert "primary" >}}
To compile the angular app ahead of time (for production) and copy the dist folder to Vendure's output dist folder, include the following commands in your packages.json scripts:
```json
{
  "scripts": {
    "copy": "npx copyfiles -u 1 'src/__admin-ui/dist/**/*' dist",
    "build": "tsc && yarn copy",
    "build:admin": "rimraf admin-ui && npx ts-node src/compile-admin-ui.ts",
  }
}
```
"build:admin" will remove the admin-ui folder and run the compileUiExtensions function to generate the admin-ui Angular app.
Make sure to install copyfiles before running the "copy" command:
```bash
yarn install copyfiles
```
{{< /alert >}}
