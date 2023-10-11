---
title: "RegisterBulkAction"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerBulkAction

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-bulk-action.ts" sourceLine="52" packageName="@vendure/admin-ui" since="1.8.0" />

Registers a custom <a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkaction'>BulkAction</a> which can be invoked from the bulk action menu
of any supported list view.

This allows you to provide custom functionality that can operate on any of the selected
items in the list view.

In this example, imagine we have an integration with a 3rd-party text translation service. This
bulk action allows us to select multiple products from the product list view, and send them for
translation via a custom service which integrates with the translation service's API.

*Example*

```ts title="providers.ts"
import { ModalService, registerBulkAction, SharedModule } from '@vendure/admin-ui/core';
import { ProductDataTranslationService } from './product-data-translation.service';

export default [
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
];
```

```ts title="Signature"
function registerBulkAction(bulkAction: BulkAction): FactoryProvider
```
Parameters

### bulkAction

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkaction'>BulkAction</a>`} />

