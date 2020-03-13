---
title: 'Extending the Admin UI'
weight: 3
---

# Extending the Admin UI

When creating a plugin, you may wish to extend the Admin UI in order to expose an interface to the plugin's functionality.

This is possible by defining [AdminUiExtensions]({{< ref "admin-ui-extension" >}}). A UI extension is an [Angular module](https://angular.io/guide/ngmodules) which gets compiled into the Admin UI application bundle by the [`compileUiExtensions`]({{< relref "compile-ui-extensions" >}}) function exported by the `@vendure/ui-devkit` package.

{{% alert warning %}}
Note: a basic understanding of [Angular](https://angular.io/) is required to successfully work with UI extensions. Try [Angular's "Getting Started" guide](https://angular.io/start) to learn more.
{{% /alert %}}

{{% alert "primary" %}}
For a complete working example of a Vendure plugin which extends the Admin UI, see the [real-world-vendure Reviews plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/reviews)
{{% /alert %}}

## Simple Example

Here is a very simple example to illustrate how a UI extension works:

### 1. Install `@vendure/ui-devkit`

To create UI extensions, you'll need to install the `@vendure/ui-devkit` package. This package contains a compiler for building your
customized version of the Admin UI, as well as the Angular dependencies you'll need to create your extensions.

```bash
yarn add @vendure/ui-devkit

# or

npm install @vendure/ui-devkit
```

### 2. Create a simple component

Here's a very simple Angular component which displays a greeting:

```TypeScript
// project/ui-extensions/greeter.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'greeter',
  template: `<h1>{{ greeting }}</h1>`,
})
export class GreeterComponent {
  greeting = 'Hello!';
}
```

### 3. Create the Angular module

Next we need to declare an Angular module to house the component:

```TypeScript
// project/ui-extensions/greeter.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { GreeterComponent } from './greeter.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      component: GreeterComponent,
      data: { breadcrumb: 'Greeter' },
    }]),
  ],
  declarations: [GreeterComponent],
})
export class GreeterModule {}
```

{{% alert "primary" %}}
**Note:** The `SharedModule` should, in general, always be imported by your extension modules. It provides the basic Angular
directives and other common functionality that any extension would require.
{{% /alert %}}

### 4. Pass the extension to the `compileUiExtensions` function

Now we need to tell the `compileUiExtensions` function where to find the extension, and which file contains the NgModule itself (since a non-trivial UI extension will likely contain multiple files).

```TypeScript
// project/vendure-config.ts
import path from 'path';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { VendureConfig } from '@vendure/core';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';

export const config: VendureConfig = {
  // ...
  plugins: [
    AdminUiPlugin.init({
      port: 5001,
      app: compileUiExtensions({
        outputPath: path.join(__dirname, 'admin-ui'),
        extensions: [{
          extensionPath: path.join(__dirname, 'ui-extensions'),
          ngModules: [{
            type: 'lazy',
            route: 'greet',
            ngModuleFileName: 'greeter.module.ts',
            ngModuleName: 'GreeterModule',
          }],
        }],
      }),
    }),
  ],
}
```

### 5. Start the server to compile

The `compileUiExtensions()` function returns a `compile()` function which will be invoked by the AdminUiPlugin upon server bootstrap. During this compilation process, a new directory will be generated at `/admin-ui` (as specified by the `outputPath` option) which will contains the uncompiled sources of your new Admin UI app.

Next, these source files will be run through the Angular compiler, the output of which will be visible in the console.

```console
info 9/25/19, 09:54 - [AdminUiPlugin] Compiling Admin UI app in production mode...

<output of Angular CLI compiler>

info 9/25/19, 09:55 - [AdminUiPlugin] Admin UI successfully compiled
```

Now go to the Admin UI app in your browser and log in. You should now be able to manually enter the URL `http://localhost:3000/admin/extensions/greet` and you should see the component with the "Hello!" header:

{{< figure src="./ui-extensions-greeter.jpg" >}}


## Dev mode

When you are developing your Admin UI extension, you can set the `devMode` option to `true` which will compile the Admin UI app in development mode, and recompile and auto-refresh the browser on any changes to your extension source files.

```TypeScript
// project/vendure-config.ts
plugins: [
  AdminUiPlugin.init({
    port: 3002,
    app: compileUiExtensions({
      outputPath: path.join(__dirname, 'admin-ui'),
      extensions: [{
        // ...
      }],
      devMode: true,
    }),
  }),
],
```


## Lazy vs Shared Modules

In the above example we set the `type` to `'lazy'`. A lazy module is not loaded when the Admin UI app is bootstrapped. It is only lazily-loaded when the `/extensions/greet` route is activated. This allows you to create large, complex extensions without impacting the initial load time of your Admin UI.

The other kind of extension module is `'shared'`. These are not lazily-loaded and are used to customize the shared interface elements such as the navigation menu items. Let's explore this by adding a menu item for our Greeter module.

## Custom navigation

### Extending the NavMenu

Once you have defined some custom routes in a lazy extension module, you need some way for the administrator to access them. For this you will use the `addNavMenuItem` and `addNavMenuSection` functions. Let's add a new section to the Admin UI main nav bar containing a link to the lazy module from the simple example above:

```TypeScript
// project/ui-extensions/greeter-shared.module.ts
import { NgModule } from '@angular/core';
import { SharedModule, addNavMenuSection } from '@vendure/admin-ui/core';

@NgModule({
  imports: [SharedModule],
  providers: [
    addNavMenuSection({
      id: 'greeter',
      label: 'My Extensions',
      items: [{
        id: 'greeter',
        label: 'Greeter',
        routerLink: ['/extensions/greet'],
        // Icon can be any of https://clarity.design/icons
        icon: 'cursor-hand-open',
      }],
    },
    // Add this section before the "settings" section
    'settings'),
  ]
})
export class GreeterSharedModule {}
```

Now we must also register this new module with the compiler:

```TypeScript
// project/vendure-config.ts

ngModules: [
  {
    type: 'lazy',
    route: 'greet',
    ngModuleFileName: 'greeter.module.ts',
    ngModuleName: 'GreeterModule',
  },
  {
    type: 'shared',
    ngModuleFileName: 'greeter-shared.module.ts',
    ngModuleName: 'GreeterSharedModule',
  }
],
```

Running the server will compile our new shared module into the app, and the result should look like this:

{{< figure src="./ui-extensions-navbar.jpg" >}}

### Adding new ActionBar buttons

It may not always make sense to navigate to your extension view from the main nav menu. For example, a "product reviews" extension that shows reviews for a particular product. In this case, you can add new buttons to the "ActionBar", which is the horizontal section at the top of each screen containing the primary actions for that view.

Here's an example of how this is done:

```TypeScript
import { NgModule } from '@angular/core';
import { SharedModule, addActionBarItem } from '@vendure/admin-ui/core';

@NgModule({
  imports: [SharedModule],
  providers: [
    addActionBarItem({
       id: 'product-reviews',
       label: 'Product reviews',
       locationId: 'product-detail',
       buttonStyle: 'outline',
       routerLink: ['./reviews'],
       requiresPermission: 'SuperAdmin'
    }),
  ],
})
export class SharedExtensionModule {}
```

{{< figure src="./ui-extensions-actionbar.jpg" >}}

In each list or detail view in the app, the ActionBar has a unique `locationId` which is how the app knows in which view to place your button. Here is a complete list of available locations into which you can add new ActionBar buttons:

```text
asset-list
collection-detail
collection-list
facet-detail
facet-list
product-detail
product-list
customer-detail
customer-list
promotion-detail
promotion-list
order-detail
order-list
administrator-detail
administrator-list
channel-detail
channel-list
country-detail
country-list
global-settings-detail
payment-method-detail
payment-method-list
role-detail
role-list
shipping-method-detail
shipping-method-list
tax-category-detail
tax-category-list
tax-rate-detail
tax-rate-list
```

## CustomField controls

Another way to extend the Admin UI app is to define custom form control components for manipulating any [Custom Fields]({{< ref "/docs/typescript-api/custom-fields" >}}) you have defined on your entities.

Let's say you define a custom "intensity" field on the Product entity:

```TypeScript
// project/vendure-config.ts

customFields: {
  Product: [
    { name: 'intensity', type: 'int', min: 0, max: 100, defaultValue: 0 },
  ],
}
```

By default, the "intensity" field will be displayed as a number input:

{{< figure src="./ui-extensions-custom-field-default.jpg" >}}

But let's say we want to display a range slider instead. Here's how we can do this using our shared extension module combined with the `registerCustomFieldComponent()` function:

```TypeScript
import { NgModule, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedModule, CustomFieldControl, 
  CustomFieldConfigType, registerCustomFieldComponent } from '@vendure/admin-ui/core';

@Component({
  template: `
    <input
        type="range"
        [min]="customFieldConfig.intMin"
        [max]="customFieldConfig.intMax"
        [formControl]="formControl" />
    {{ formControl.value }}
  `,
})
export class SliderControl implements CustomFieldControl {
  customFieldConfig: CustomFieldConfigType;
  formControl: FormControl;
}

@NgModule({
  imports: [SharedModule],
  declarations: [SliderControl],
  providers: [
    registerCustomFieldComponent('Product', 'intensity', SliderControl),
  ]
})
export class SharedExtensionModule { }
```

Re-compiling the Admin UI will result in our SliderControl now being used for the "intensity" custom field:

{{< figure src="./ui-extensions-custom-field-slider.jpg" >}}

To recap the steps involved:

1. Create an Angular Component which implements the `CustomFieldControl` interface.
2. Add this component to your shared extension module's `declarations` array.
3. Use `registerCustomFieldComponent()` to register your component for the given entity & custom field name.

## Compiling as a deployment step

Although the examples so far all use the `compileUiExtensions` function in conjunction with the AdminUiPlugin, it is also possible to use it on its own:

```TypeScript
// compile-admin-ui.ts
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';

compileUiExtensions({
  outputPath: path.join(__dirname, 'admin-ui'),
  extensions: [/* ... */],
}).compile();
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
