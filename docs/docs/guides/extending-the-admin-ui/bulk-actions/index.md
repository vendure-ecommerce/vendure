---
title: 'Bulk Actions for List Views'
---

List views in the Admin UI support bulk actions, which are performed on any selected items in the list. There are a default set of bulk actions that are defined by the Admin UI itself (e.g. delete, assign to channels), but using the `@vendure/ui-devit` package you are also able to define your own bulk actions.

![./bulk-actions-screenshot.webp](./bulk-actions-screenshot.webp)

Use cases for bulk actions include things like:

- Sending multiple products to a 3rd-party localization service
- Exporting selected products to csv
- Bulk-updating custom field data

### Bulk Action Example

Bulk actions are declared using the [`registerBulkAction` function](/reference/admin-ui-api/bulk-actions/register-bulk-action/)

```ts title="src/plugins/translation/ui/providers.ts"
import { ModalService, registerBulkAction } from '@vendure/admin-ui/core';
import { ProductDataTranslationService } from './product-data-translation.service';

export default [
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
        onClick: ({injector, selection}) => {
            const modalService = injector.get(ModalService);
            const translationService = injector.get(ProductDataTranslationService);
            modalService
                .dialog({
                    title: `Send ${selection.length} products for translation?`,
                    buttons: [
                        {type: 'secondary', label: 'cancel'},
                        {type: 'primary', label: 'send', returnValue: true},
                    ],
                })
                .subscribe(response => {
                    if (response) {
                        translationService.sendForTranslation(selection.map(item => item.productId));
                    }
                });
        },
    }),
];
```

### Conditionally displaying bulk actions

Sometimes a bulk action only makes sense in certain circumstances. For example, the "assign to channel" action only makes sense when your server has multiple channels set up.

We can conditionally control the display of a bulk action with the `isVisible` function, which should return a Promise resolving to a boolean:

```ts title="src/plugins/my-plugin/ui/providers.ts"
import { registerBulkAction, DataService } from '@vendure/admin-ui/core';

export default [
    registerBulkAction({
        location: 'product-list',
        label: 'Assign to channel',
        // Only display this action if there are multiple channels
        isVisible: ({ injector }) => injector.get(DataService).client
            .userStatus()
            .mapSingle(({ userStatus }) => 1 < userStatus.channels.length)
            .toPromise(),
        // ...
    }),
];
```
