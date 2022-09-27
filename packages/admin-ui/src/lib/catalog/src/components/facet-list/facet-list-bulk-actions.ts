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
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import { AssignToChannelDialogComponent } from '../assign-to-channel-dialog/assign-to-channel-dialog.component';

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

export const assignFacetsToChannelBulkAction: BulkAction<GetFacetList.Items, FacetListComponent> = {
    location: 'facet-list',
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
            .fromComponent(AssignToChannelDialogComponent, {
                size: 'md',
                locals: {},
            })
            .pipe(
                switchMap(result => {
                    if (result) {
                        return dataService.facet
                            .assignFacetsToChannel({
                                facetIds: selection.map(f => f.id),
                                channelId: result.id,
                            })
                            .pipe(mapTo(result));
                    } else {
                        return EMPTY;
                    }
                }),
            )
            .subscribe(result => {
                notificationService.success(_('catalog.assign-facets-to-channel-success'), {
                    channel: result.code,
                });
                clearSelection();
            });
    },
};

export const removeFacetsFromChannelBulkAction: BulkAction<GetFacetList.Items, FacetListComponent> = {
    location: 'facet-list',
    label: _('common.remove-from-active-channel'),
    icon: 'layers',
    iconClass: 'is-warning',
    isVisible: ({ injector }) => {
        return injector
            .get(DataService)
            .client.userStatus()
            .mapSingle(({ userStatus }) => {
                if (userStatus.channels.length === 1) {
                    return false;
                }
                const defaultChannelId = userStatus.channels.find(c => c.code === DEFAULT_CHANNEL_CODE)?.id;
                return userStatus.activeChannelId !== defaultChannelId;
            })
            .toPromise();
    },
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);

        function showModalAndDelete(facetIds: string[], message?: string) {
            return modalService
                .dialog({
                    title: _('catalog.confirm-remove-facets-from-channel'),
                    translationVars: {
                        count: selection.length,
                    },
                    size: message ? 'lg' : 'md',
                    body: message,
                    buttons: [
                        { type: 'secondary', label: _('common.cancel') },
                        {
                            type: 'danger',
                            label: message ? _('common.force-remove') : _('common.remove'),
                            returnValue: true,
                        },
                    ],
                })
                .pipe(
                    switchMap(res =>
                        res
                            ? dataService.client
                                  .userStatus()
                                  .mapSingle(({ userStatus }) => userStatus.activeChannelId)
                                  .pipe(
                                      switchMap(activeChannelId =>
                                          activeChannelId
                                              ? dataService.facet.removeFacetsFromChannel({
                                                    channelId: activeChannelId,
                                                    facetIds,
                                                    force: !!message,
                                                })
                                              : EMPTY,
                                      ),
                                      map(res2 => res2.removeFacetsFromChannel),
                                  )
                            : of([]),
                    ),
                );
        }

        showModalAndDelete(unique(selection.map(f => f.id)))
            .pipe(
                switchMap(result => {
                    let removedCount = 0;
                    const errors: string[] = [];
                    const errorIds: string[] = [];
                    let i = 0;
                    for (const item of result) {
                        if (item.__typename === 'Facet') {
                            removedCount++;
                        } else if (item.__typename === 'FacetInUseError') {
                            errors.push(item.message);
                            errorIds.push(selection[i]?.id);
                        }
                        i++;
                    }
                    if (0 < errorIds.length) {
                        return showModalAndDelete(errorIds, errors.join('\n')).pipe(
                            map(result2 => {
                                const deletedCount2 = result2.filter(r => r.__typename === 'Facet').length;
                                return removedCount + deletedCount2;
                            }),
                        );
                    } else {
                        return of(removedCount);
                    }
                }),
            )
            .subscribe(removedCount => {
                if (removedCount) {
                    hostComponent.refresh();
                    clearSelection();
                    notificationService.success(_('common.notify-remove-facets-from-channel-success'), {
                        count: removedCount,
                    });
                }
            });
    },
};
