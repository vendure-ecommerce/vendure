import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FacetListComponent } from '@vendure/admin-ui/catalog';
import {
    BulkAction,
    DataService,
    DeletionResult,
    GetFacetList,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export const deleteFacetsBulkAction: BulkAction<GetFacetList.Items, FacetListComponent> = {
    location: 'facet-list',
    label: _('common.delete'),
    icon: 'trash',
    iconClass: 'is-danger',
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);

        function showModalAndDelete(facetIds: string[], message?: string) {
            return modalService
                .dialog({
                    title: _('catalog.confirm-bulk-delete-facets'),
                    translationVars: {
                        count: selection.length,
                    },
                    size: message ? 'lg' : 'md',
                    body: message,
                    buttons: [
                        { type: 'secondary', label: _('common.cancel') },
                        {
                            type: 'danger',
                            label: message ? _('common.force-delete') : _('common.delete'),
                            returnValue: true,
                        },
                    ],
                })
                .pipe(
                    switchMap(res =>
                        res
                            ? dataService.facet
                                  .deleteFacets(facetIds, !!message)
                                  .pipe(map(res2 => res2.deleteFacets))
                            : of([]),
                    ),
                );
        }

        showModalAndDelete(unique(selection.map(f => f.id)))
            .pipe(
                switchMap(result => {
                    let deletedCount = 0;
                    const errors: string[] = [];
                    const errorIds: string[] = [];
                    let i = 0;
                    for (const item of result) {
                        if (item.result === DeletionResult.DELETED) {
                            deletedCount++;
                        } else if (item.message) {
                            errors.push(item.message);
                            errorIds.push(selection[i]?.id);
                        }
                        i++;
                    }
                    if (0 < errorIds.length) {
                        return showModalAndDelete(errorIds, errors.join('\n')).pipe(
                            map(result2 => {
                                const deletedCount2 = result2.filter(
                                    r => r.result === DeletionResult.DELETED,
                                ).length;
                                return deletedCount + deletedCount2;
                            }),
                        );
                    } else {
                        return of(deletedCount);
                    }
                }),
            )
            .subscribe(deletedCount => {
                if (deletedCount) {
                    hostComponent.refresh();
                    clearSelection();
                    notificationService.success(_('common.notify-bulk-delete-success'), {
                        count: deletedCount,
                        entity: 'Facets',
                    });
                }
            });
    },
};

// export const assignProductsToChannelBulkAction: BulkAction<SearchProducts.Items, ProductListComponent> = {
//     location: 'product-list',
//     label: _('catalog.assign-to-channel'),
//     icon: 'layers',
//     isVisible: ({ injector }) => {
//         return injector
//             .get(DataService)
//             .client.userStatus()
//             .mapSingle(({ userStatus }) => 1 < userStatus.channels.length)
//             .toPromise();
//     },
//     onClick: ({ injector, selection, hostComponent, clearSelection }) => {
//         const modalService = injector.get(ModalService);
//         const dataService = injector.get(DataService);
//         const notificationService = injector.get(NotificationService);
//         modalService
//             .fromComponent(AssignProductsToChannelDialogComponent, {
//                 size: 'lg',
//                 locals: {
//                     productIds: unique(selection.map(p => p.productId)),
//                     currentChannelIds: [],
//                 },
//             })
//             .subscribe(result => {
//                 if (result) {
//                     clearSelection();
//                 }
//             });
//     },
// };
