import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BulkAction,
    DataService,
    DeletionResult,
    ModalService,
    NotificationService,
    Permission,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ProductVariantListComponent } from './product-variant-list.component';

export const deleteProductVariantsBulkAction: BulkAction<any, ProductVariantListComponent> = {
    location: 'product-list',
    label: _('common.delete'),
    icon: 'trash',
    iconClass: 'is-danger',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.DeleteProduct) ||
        userPermissions.includes(Permission.DeleteCatalog),
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);
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
            .pipe(
                switchMap(response =>
                    response
                        ? dataService.product.deleteProducts(unique(selection.map(p => p.productId)))
                        : EMPTY,
                ),
            )
            .subscribe(result => {
                let deleted = 0;
                const errors: string[] = [];
                for (const item of result.deleteProducts) {
                    if (item.result === DeletionResult.DELETED) {
                        deleted++;
                    } else if (item.message) {
                        errors.push(item.message);
                    }
                }
                if (0 < deleted) {
                    notificationService.success(_('catalog.notify-bulk-delete-products-success'), {
                        count: deleted,
                    });
                }
                if (0 < errors.length) {
                    notificationService.error(errors.join('\n'));
                }
                hostComponent.refresh();
                clearSelection();
            });
    },
};
