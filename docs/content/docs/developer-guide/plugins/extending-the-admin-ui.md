---
title: "Extending the Admin UI"
weight: 1
---
# Extending the Admin UI 

When creating a plugin, you may wish to extend the Admin UI in order to expose an interface to the plugin's functionality.

This is possible by defining [AdminUiExtensions]({{< ref "admin-ui-extension" >}}). A UI extension is an [Angular module](https://angular.io/guide/ngmodules) which gets compiled into the Admin UI application bundle by the AdminUiPlugin.

{{% alert warning %}}
Note: an understanding of [Angular](https://angular.io/) is required to successfully work with UI extensions. Try [Angular's "Getting Started" guide](https://angular.io/start) to learn more.
{{% /alert %}}

{{% alert "primary" %}}
  For a complete working example of a Vendure plugin which extends the Admin UI, see the [real-world-vendure Reviews plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/reviews)
{{% /alert %}}

## Simple Example

Here is a very simple example to illustrate how a UI extension works:

### 1. Create the Angular module

Below is an Angular module with a single component `GreeterComponent` which displays a greeting. A route is defined to load `GreeterComponent` at the route `/greet`.

```TypeScript
// project/ui-extensions/greeter-extension.module.ts

import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/src';

@Component({
    selector: 'greeter',
    template: `<h1>{{ greeting }}</h1>`,
})
export class GreeterComponent {
    greeting = 'Hello!';
}

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: 'greet',
            component: GreeterComponent,
            data: { breadcrumb: 'Greeter' },
        }]),
    ],
    declarations: [GreeterComponent],
})
export class GreeterModule {}
```

### 2. Define the extension in the AdminUiOptions

Now we need to tell the AdminUiPlugin where to find the extension, and which file contains the NgModule itself (since a non-trivial UI extension will likely contain multiple files).

```TypeScript
// project/vendure-config.ts 

import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    plugins: [
        AdminUiPlugin.init({
            port: 5001,
            extensions: [
                {
                    extensionPath: path.join(__dirname, 'ui-extensions'),
                    ngModules: [{
                        type: 'lazy',
                        ngModuleFileName: 'greeter-extension.module.ts',
                        ngModuleName: 'GreeterModule',
                    }],
                }
            ],
        })
    ]
}
```

### 3. Test the extension

Running the Vendure server will now cause the UI extension to be compiled into the Admin UI application. In the console you'll see a message like:

```console
info 9/25/19, 09:54 - [Vendure Server] Bootstrapping Vendure Server (pid: 43092)...
info 9/25/19, 09:54 - [AdminUiPlugin] Compiling Admin UI with extensions...

<output of Angular CLI compiler>

info 9/25/19, 09:55 - [AdminUiPlugin] Completed compilation!
```

Now go to the Admin UI app in your browser and log in. You should now be able to manually enter the URL `http://localhost:3000/admin/extensions/greet` and you should see the component with the "Hello!" header:

{{< figure src="../ui-extensions-greeter.jpg" >}} 

## Lazy vs Shared Modules

In the above example we set the `type` to `'lazy'`. A lazy module is not loaded when the Admin UI app is bootstrapped. It is only lazily-loaded when the `/extensions` route is activated. For this reason, lazy modules should not be used to host any logic that should be executed at bootstrap time, or that applies to other parts of the Admin UI app. For such logic, `'shared'` modules should be used.

Shared modules get imported into the main Admin UI `AppModule` and therefore are present at bootstrap time. The main use-case for shared modules is to define custom navigation items and custom field controls using the `NavBuilderService` and the `CustomFieldComponentService` respectively (see below).

## Custom navigation: NavBuilderService

### Extending the NavMenu 

Once you have defined some custom views in a lazy extension module, you need some way for the administrator to access these views. For this you will use the `NavBuilderService` to define new navigation items. Let's add a new section to the Admin UI main nav bar containing a link to the lazy module from the simple example above:

```TypeScript
// project/ui-extensions/shared-extension.module.ts

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { SharedModule, NavBuilderService } from '@vendure/admin-ui/src';

@NgModule({
    imports: [SharedModule],
    providers: [{
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: addNavItems,
        deps: [NavBuilderService],
    }]
})
export class SharedExtensionModule {}

export function addNavItems(navBuilderService: NavBuilderService) {
    return () => {
        navBuilderService.addNavMenuSection({
            id: 'greeter',
            label: 'My Extensions',
            items: [
                {
                    id: 'greeter',
                    label: 'Greeter',
                    routerLink: ['/extensions/greet'],
                    // Icon can by any of https://clarity.design/icons
                    icon: 'cursor-hand-open',
                },
            ],
        },
            // Add this section before the "settings" section
            'settings');
    };
}
```

This module makes use of the [APP_INITIALIZER](https://angular.io/api/core/APP_INITIALIZER) provider, which allows us to execute logic which runs when the Angular app completes initialization. In the `addNavItems()` function we return a new function in which we add a new section to the nav menu.

Next we must add this shared module to the AdminUiOptions:

```TypeScript
// project/vendure-config.ts 

    plugins: [
        AdminUiPlugin.init({ 
            port: 3002,
            extensions: [
                {
                    extensionPath: path.join(__dirname, 'ui-extensions'),
                    ngModules: [{
                        type: 'lazy',
                        ngModuleFileName: 'greeter-extension.module.ts',
                        ngModuleName: 'GreeterModule',
                    }, {
                        type: 'shared',
                        ngModuleFileName: 'shared-extension.module.ts',
                        ngModuleName: 'SharedExtensionModule',
                    }],
                },
            ],
        }),
    ],
```

Running the server will compile our new shared module into the app, and the result should look like this:

{{< figure src="../ui-extensions-navbar.jpg" >}} 

### Adding new ActionBar buttons

It may not always make sense to navigate to your extension view from the main nav menu. For example, a "product reviews" extension that shows reviews for a particular product. In this case, you can add new buttons to the "ActionBar", which is the horizontal section at the top of each screen containing the primary actions for that view.

Here's an example of how this is done:

```TypeScript
@NgModule({
    imports: [SharedModule],
    providers: [{
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: addNavItems,
        deps: [NavBuilderService],
    }]
})
export class SharedExtensionModule {}

export function addNavItems(navBuilderService: NavBuilderService) {
    return () => {
        navBuilderService.addActionBarItem({
            id: 'product-reviews',
            label: 'Product reviews',
            locationId: 'product-detail',
            buttonStyle: 'outline',
            routerLink: ['./reviews'],
            requiresPermission: 'SuperAdmin'
        });
    };
}
```

{{< figure src="../ui-extensions-actionbar.jpg" >}} 

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

## CustomField controls: CustomFieldComponentService

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

{{< figure src="../ui-extensions-custom-field-default.jpg" >}} 

But let's say we want to display a range slider instead. Here's how we can do this using our shared extension module combined with the `CustomFieldComponentService`:

```TypeScript
import { NgModule, APP_INITIALIZER, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedModule, CustomFieldControl, CustomFieldConfig, CustomFieldComponentService } from '@vendure/admin-ui/src';

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
    customFieldConfig: CustomFieldConfig;
    formControl: FormControl;
}

@NgModule({
    imports: [SharedModule],
    declarations: [SliderControl],
    entryComponents: [SliderControl],
    providers: [{
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: defineCustomFieldControls,
        deps: [CustomFieldComponentService],
    }]
})
export class SharedExtensionModule { }

export function defineCustomFieldControls(customFieldComponentService: CustomFieldComponentService) {
    return () => {
        customFieldComponentService.registerCustomFieldComponent('Product', 'intensity', SliderControl);
    }
}
```

Re-compiling the Admin UI will result in our SliderControl now being used for the "intensity" custom field:

{{< figure src="../ui-extensions-custom-field-slider.jpg" >}} 

To recap the steps involved:

1. Create an Angular Component which implements the `CustomFieldControl` interface.
2. Add this component to your shared extension module's `declarations` and `entryComponents` arrays.
3. Create a function to run on app initialization and use the `CustomFieldComponentService` to register your component for the given entity & custom field name.

## Watch mode

When you are developing your Admin UI extension, you can set the `watch` option to `true` which will compile the Admin UI app in development mode, and recompile and auto-refresh the browser on any changes to your extension source files.

```TypeScript
// project/vendure-config.ts 

    plugins: [
        AdminUiPlugin.init({ 
            port: 3002,
            extensions: [
                {
                    extensionPath: path.join(__dirname, 'ui-extensions'),
                    ngModules: [{
                        type: 'lazy',
                        ngModuleFileName: 'greeter-extension.module.ts',
                        ngModuleName: 'GreeterModule',
                    }],
                }
            ],
            watch: true,
        }),
    ],
```
