---
title: 'Add Actions To Pages'
weight: 5
---

# Add Actions To Pages


## Adding ActionBar buttons

It may not always make sense to navigate to your extension view from the main nav menu. For example, a "product reviews" extension that shows reviews for a particular product. In this case, you can add new buttons to the "ActionBar", which is the horizontal section at the top of each screen containing the primary actions for that view. This is done using the [addActionBarItem function]({{< relref "add-action-bar-item" >}}).

### ActionBar Example

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

## Adding Bulk Actions

Certain list views in the Admin UI support bulk actions. There are a default set of bulk actions that are defined by the Admin UI itself (e.g. delete, assign to channels), but using the `@vendure/ui-devit` package
you are also able to define your own bulk actions.

{{< figure src="./bulk-actions-screenshot.png" >}}

Use cases for bulk actions include things like:

- Sending multiple products to a 3rd-party localization service
- Exporting selected products to csv
- Bulk-updating custom field data

### Bulk Action Example

A bulk action must be provided to a [ui-extension shared module]({{< relref "extending-the-admin-ui" >}}#lazy-vs-shared-modules) using the [`registerBulkAction` function]({{< relref "register-bulk-action" >}})

```TypeScript
import { NgModule } from '@angular/core';
import { ModalService, registerBulkAction, SharedModule } from '@vendure/admin-ui/core';

@NgModule({
  imports: [SharedModule],
  providers: [
    ProductDataTranslationService,

    // Here is where we define our bulk action
    // for sending the selected products to a 3rd-party
    // translation API
    registerBulkAction({
      // This tells the Admin UI that this bulk action should be made
      // available on the product list view.
      location: 'product-list',
      label: 'Send to translation service',
      icon: 'language',
      // Here is the logic that is executed when the bulk action menu item
      // is clicked.
      onClick: ({ injector, selection }) => {
        const modalService = injector.get(ModalService);
        const translationService = injector.get(ProductDataTranslationService);
        modalService
          .dialog({
            title: `Send ${selection.length} products for translation?`,
            buttons: [
              { type: 'secondary', label: 'cancel' },
              { type: 'primary', label: 'send', returnValue: true },
            ],
          })
          .subscribe(response => {
            if (response) {
              translationService.sendForTranslation(selection.map(item => item.productId));
            }
          });
      },
    }),
  ],
})
export class MyUiExtensionModule {}
```

### Conditionally displaying bulk actions

Sometimes a bulk action only makes sense in certain circumstances. For example, the "assign to channel" action only makes sense when your server has multiple channels set up.

We can conditionally control the display of a bulk action with the `isVisible` function, which should return a Promise resolving to a boolean:

```TypeScript
import { registerBulkAction, DataService } from '@vendure/admin-ui/core';

registerBulkAction({
  location: 'product-list',
  label: 'Assign to channel',
  // Only display this action if there are multiple channels
  isVisible: ({ injector }) => injector.get(DataService).client
    .userStatus()
    .mapSingle(({ userStatus }) => 1 < userStatus.channels.length)
    .toPromise(),
  // ...
});
```

Related API docs:

- [`registerBulkAction`]({{< relref "register-bulk-action" >}})
- [`BulkAction`]({{< relref "bulk-action" >}})
