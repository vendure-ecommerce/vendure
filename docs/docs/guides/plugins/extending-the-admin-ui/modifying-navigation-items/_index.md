---
title: 'Modify Navigation Items'
weight: 5
---

# Adding Navigation Items

## Extending the NavMenu

Once you have defined some custom routes in a lazy extension module, you need some way for the administrator to access them. For this you will use the [addNavMenuItem]({{< relref "add-nav-menu-item" >}}) and [addNavMenuSection]({{< relref "add-nav-menu-item" >}}) functions.

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

{{< figure src="./ui-extensions-navbar.webp" >}}

## Overriding existing nav items

It is also possible to override one of the default (built-in) nav menu sections or items. This can be useful for example if you wish to provide a completely different implementation of the product list view.

This is done by setting the `id` property to that of an existing nav menu section or item.

## Adding page tabs

You can add your own tabs to any of the Admin UI's list or detail pages using the [registerPageTab]({{< relref "register-page-tab" >}}) function. For example, to add a new tab to the product detail page for displaying product reviews:

```TypeScript
import { NgModule } from '@angular/core';
import { SharedModule, registerPageTab } from '@vendure/admin-ui/core';

import { ReviewListComponent } from './components/review-list/review-list.component';

@NgModule({
  imports: [SharedModule],
  providers: [
    registerPageTab({
      location: 'product-detail',
      tab: 'Reviews',
      route: 'reviews',
      tabIcon: 'star',
      component: ReviewListComponent,
    }),
  ]
})
export class ReviewsSharedModule {}
```

{{< figure src="./ui-extensions-tabs.webp" >}}
