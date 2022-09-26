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
