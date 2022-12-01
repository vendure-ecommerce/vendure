import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BulkAction,
    currentChannelIsNotDefault,
    DataService,
    DeletionResult,
    getChannelCodeFromUserStatus,
    isMultiChannel,
    ModalService,
    NotificationService,
    Permission,
    SearchProducts,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY, from, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { AssignProductsToChannelDialogComponent } from '../assign-products-to-channel-dialog/assign-products-to-channel-dialog.component';
import { BulkAddFacetValuesDialogComponent } from '../bulk-add-facet-values-dialog/bulk-add-facet-values-dialog.component';

import { ProductListComponent } from './product-list.component';

export const deleteProductsBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
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

export const assignProductsToChannelBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
    location: 'product-list',
    label: _('catalog.assign-to-channel'),
    icon: 'layers',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.UpdateCatalog) ||
        userPermissions.includes(Permission.UpdateProduct),
    isVisible: ({ injector }) => isMultiChannel(injector.get(DataService)),
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);
        modalService
            .fromComponent(AssignProductsToChannelDialogComponent, {
                size: 'lg',
                locals: {
                    productIds: unique(selection.map(p => p.productId)),
                    currentChannelIds: [],
                },
            })
            .subscribe(result => {
                if (result) {
                    clearSelection();
                }
            });
    },
};

export const removeProductsFromChannelBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
    location: 'product-list',
    label: _('catalog.remove-from-channel'),
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.UpdateChannel) ||
        userPermissions.includes(Permission.UpdateProduct),
    getTranslationVars: ({ injector }) => getChannelCodeFromUserStatus(injector.get(DataService)),
    icon: 'layers',
    iconClass: 'is-warning',
    isVisible: ({ injector }) => currentChannelIsNotDefault(injector.get(DataService)),
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);
        const activeChannelId$ = dataService.client
            .userStatus()
            .mapSingle(({ userStatus }) => userStatus.activeChannelId);

        from(getChannelCodeFromUserStatus(injector.get(DataService)))
            .pipe(
                switchMap(({ channelCode }) =>
                    modalService.dialog({
                        title: _('catalog.remove-from-channel'),
                        translationVars: {
                            channelCode,
                        },
                        buttons: [
                            { type: 'secondary', label: _('common.cancel') },
                            {
                                type: 'danger',
                                label: _('common.remove'),
                                returnValue: true,
                            },
                        ],
                    }),
                ),
                switchMap(res =>
                    res
                        ? activeChannelId$.pipe(
                              switchMap(activeChannelId =>
                                  activeChannelId
                                      ? dataService.product.removeProductsFromChannel({
                                            channelId: activeChannelId,
                                            productIds: selection.map(p => p.productId),
                                        })
                                      : EMPTY,
                              ),
                              mapTo(true),
                          )
                        : of(false),
                ),
            )
            .subscribe(removed => {
                if (removed) {
                    clearSelection();
                    notificationService.success(_('common.notify-remove-products-from-channel-success'), {
                        count: selection.length,
                    });
                    setTimeout(() => hostComponent.refresh(), 1000);
                }
            });
    },
};

export const assignFacetValuesToProductsBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
    location: 'product-list',
    label: _('catalog.edit-facet-values'),
    icon: 'tag',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.UpdateCatalog) ||
        userPermissions.includes(Permission.UpdateProduct),
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);
        const mode: 'product' | 'variant' = hostComponent.groupByProduct ? 'product' : 'variant';
        const ids =
            mode === 'product'
                ? unique(selection.map(p => p.productId))
                : unique(selection.map(p => p.productVariantId));
        return modalService
            .fromComponent(BulkAddFacetValuesDialogComponent, {
                size: 'xl',
                locals: {
                    mode,
                    ids,
                },
            })
            .subscribe(result => {
                if (result) {
                    notificationService.success(_('common.notify-bulk-update-success'), {
                        count: selection.length,
                        entity: mode === 'product' ? 'Products' : 'ProductVariants',
                    });
                    clearSelection();
                }
            });
    },
};
