---
title: 'Overriding Navigation Items'
weight: 5
---

# Overriding Navigation Items

## Overriding existing items

It is also possible to override one of the default (built-in) nav menu sections or items. This can be useful for example if you wish to provide a completely different implementation of the product list view.

This is done by setting the `id` property to that of an existing nav menu section or item.


## Adding new ActionBar buttons

It may not always make sense to navigate to your extension view from the main nav menu. For example, a "product reviews" extension that shows reviews for a particular product. In this case, you can add new buttons to the "ActionBar", which is the horizontal section at the top of each screen containing the primary actions for that view. This is done using the [addActionBarItem function]({{< relref "add-action-bar-item" >}}).

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
      routerLink: route => {
          const id = route.snapshot.params.id;
          return ['./extensions/reviews', id];
      },
      requiresPermission: 'SuperAdmin'
    }),
  ],
})
export class SharedExtensionModule {}
```

{{< figure src="./ui-extensions-actionbar.jpg" >}}

In each list or detail view in the app, the ActionBar has a unique `locationId` which is how the app knows in which view to place your button. The complete list of available locations into which you can add new ActionBar can be found in the [ActionBarLocationId docs]({{< relref "action-bar-location-id" >}}).
