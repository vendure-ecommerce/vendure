import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import { BulkActionRegistryService } from './bulk-action-registry.service';
import { BulkAction } from './bulk-action-types';

/**
 * @description
 * Registers a custom {@link BulkAction} which can be invoked from the bulk action menu
 * of any supported list view.
 *
 * This allows you to provide custom functionality that can operate on any of the selected
 * items in the list view.
 *
 * In this example, imagine we have an integration with a 3rd-party text translation service. This
 * bulk action allows us to select multiple products from the product list view, and send them for
 * translation via a custom service which integrates with the translation service's API.
 *
 * @example
 * ```TypeScript
 * import { NgModule } from '\@angular/core';
 * import { ModalService, registerBulkAction, SharedModule } from '\@vendure/admin-ui/core';
 *
 * \@NgModule({
 *   imports: [SharedModule],
 *   providers: [
 *     ProductDataTranslationService,
 *     registerBulkAction({
 *       location: 'product-list',
 *       label: 'Send to translation service',
 *       icon: 'language',
 *       onClick: ({ injector, selection }) => {
 *         const modalService = injector.get(ModalService);
 *         const translationService = injector.get(ProductDataTranslationService);
 *         modalService
 *           .dialog({
 *             title: `Send ${selection.length} products for translation?`,
 *             buttons: [
 *               { type: 'secondary', label: 'cancel' },
 *               { type: 'primary', label: 'send', returnValue: true },
 *             ],
 *           })
 *           .subscribe(response => {
 *             if (response) {
 *               translationService.sendForTranslation(selection.map(item => item.productId));
 *             }
 *           });
 *       },
 *     }),
 *   ],
 * })
 * export class MyUiExtensionModule {}
 * ```
 * @since 1.8.0
 * @docsCategory bulk-actions
 */
export function registerBulkAction(bulkAction: BulkAction): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (registry: BulkActionRegistryService) => () => {
            registry.registerBulkAction(bulkAction);
        },
        deps: [BulkActionRegistryService],
    };
}
