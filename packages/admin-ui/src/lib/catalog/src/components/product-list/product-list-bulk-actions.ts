import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { BulkAction, DataService, ModalService } from '@vendure/admin-ui/core';
import { delay } from 'rxjs/operators';

export const deleteProductsBulkAction: BulkAction = {
    location: 'product-list',
    label: _('common.delete'),
    icon: 'trash',
    iconClass: 'is-danger',
    onClick: ({ injector, selection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        modalService
            .dialog({
                title: _('catalog.confirm-bulk-delete-products'),
                translationVars: {
                    count: selection.length,
                },
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe
            // switchMap(response =>
            //     response ? dataService.product.deleteProduct(productId) : EMPTY,
            // ),
            // Short delay to allow the product to be removed from the search index before
            // refreshing.
            ()
            .subscribe();
    },
};
