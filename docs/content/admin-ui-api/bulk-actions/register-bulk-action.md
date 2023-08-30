---
title: "RegisterBulkAction"
weight: 10
date: 2023-07-14T16:57:51.088Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# registerBulkAction
<div class="symbol">


# registerBulkAction

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/register-bulk-action.ts" sourceLine="56" packageName="@vendure/admin-ui" since="1.8.0">}}

Registers a custom <a href='/admin-ui-api/bulk-actions/bulk-action#bulkaction'>BulkAction</a> which can be invoked from the bulk action menu
of any supported list view.

This allows you to provide custom functionality that can operate on any of the selected
items in the list view.

In this example, imagine we have an integration with a 3rd-party text translation service. This
bulk action allows us to select multiple products from the product list view, and send them for
translation via a custom service which integrates with the translation service's API.

*Example*

```TypeScript
import { NgModule } from '@angular/core';
import { ModalService, registerBulkAction, SharedModule } from '@vendure/admin-ui/core';

@NgModule({
  imports: [SharedModule],
  providers: [
    ProductDataTranslationService,
    registerBulkAction({
      location: 'product-list',
      label: 'Send to translation service',
      icon: 'language',
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

## Signature

```TypeScript
function registerBulkAction(bulkAction: BulkAction): FactoryProvider
```
## Parameters

### bulkAction

{{< member-info kind="parameter" type="<a href='/admin-ui-api/bulk-actions/bulk-action#bulkaction'>BulkAction</a>" >}}

</div>
