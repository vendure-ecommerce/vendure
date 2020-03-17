---
title: 'Adding Navigation Items'
weight: 5
---

# Adding Navigation Items

## Extending the NavMenu

Once you have defined some custom routes in a lazy extension module, you need some way for the administrator to access them. For this you will use the `addNavMenuItem` and `addNavMenuSection` functions. 

Let's add a new section to the Admin UI main nav bar containing a link to the "greeter" module from the [Using Angular]({{< relref "../using-angular" >}}) example:

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


## Adding new ActionBar buttons

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
