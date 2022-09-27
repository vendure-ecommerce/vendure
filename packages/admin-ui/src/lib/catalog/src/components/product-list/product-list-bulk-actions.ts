import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BulkAction,
    DataService,
    DeletionResult,
    ModalService,
    NotificationService,
    SearchProducts,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AssignProductsToChannelDialogComponent } from '../assign-products-to-channel-dialog/assign-products-to-channel-dialog.component';
import { BulkAddFacetValuesDialogComponent } from '../bulk-add-facet-values-dialog/bulk-add-facet-values-dialog.component';

import { ProductListComponent } from './product-list.component';

export const deleteProductsBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
    location: 'product-list',
    label: _('common.delete'),
    icon: 'trash',
    iconClass: 'is-danger',
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
                    notificationService.success(_('common.notify-bulk-delete-success'), {
                        count: deleted,
                        entity: 'Products',
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
    isVisible: ({ injector }) => {
        return injector
            .get(DataService)
            .client.userStatus()
            .mapSingle(({ userStatus }) => 1 < userStatus.channels.length)
            .toPromise();
    },
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

export const assignFacetValuesToProductsBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
    location: 'product-list',
    label: _('catalog.edit-facet-values'),
    icon: 'tag',
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);
        const mode: 'product' | 'variant' = hostComponent.groupByProduct ? 'product' : 'variant';
        const ids =
            mode === 'product'
                ? unique(selection.map(p => p.productId))
                : unique(selection.map(p => p.productVariantId));
        return dataService.facet
            .getAllFacets()
            .mapSingle(data => data.facets.items)
            .pipe(
                switchMap(facets =>
                    modalService.fromComponent(BulkAddFacetValuesDialogComponent, {
                        size: 'xl',
                        locals: {
                            facets,
                            mode,
                            ids,
                        },
                    }),
                ),
            )
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
