import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BulkAction,
    DataService,
    DeletionResult,
    GetProductVariantListQuery,
    ItemOf,
    ModalService,
    NotificationService,
    Permission,
    createBulkRemoveFromChannelAction,
    isMultiChannel,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ProductVariant } from 'package/core';
import { ProductVariantListComponent } from './product-variant-list.component';

export const removeProductVariantsFromChannelBulkAction = createBulkRemoveFromChannelAction<
    ItemOf<GetProductVariantListQuery, 'productVariants'>
>({
    location: 'product-variant-list',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.UpdateCatalog) ||
        userPermissions.includes(Permission.UpdateProduct),
    getItemName: item => item.name,
    bulkRemoveFromChannel: (dataService, ids, channelId) =>
        dataService.product
            .removeVariantsFromChannel({
                channelId: channelId,
                productVariantIds: ids,
            })
            .pipe(map(res => res.removeProductVariantsFromChannel)),
});

export const deleteProductVariantsBulkAction: BulkAction<ProductVariant, ProductVariantListComponent> = {
    location: 'product-variant-list',
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
                title: _('common.confirm-bulk-delete'),
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
                        ? dataService.product.deleteProductVariants(unique(selection.map(p => p.id)))
                        : EMPTY,
                ),
            )
            .subscribe(result => {
                let deleted = 0;
                const errors: string[] = [];
                for (const item of result.deleteProductVariants) {
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
