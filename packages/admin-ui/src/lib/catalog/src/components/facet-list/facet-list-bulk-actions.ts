import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BulkAction,
    currentChannelIsNotDefault,
    DataService,
    DeletionResult,
    getChannelCodeFromUserStatus,
    GetFacetList,
    isMultiChannel,
    ModalService,
    NotificationService,
    Permission,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import { AssignToChannelDialogComponent } from '../assign-to-channel-dialog/assign-to-channel-dialog.component';

import { FacetListComponent } from './facet-list.component';

export const deleteFacetsBulkAction: BulkAction<GetFacetList.Items, FacetListComponent> = {
    location: 'facet-list',
    label: _('common.delete'),
    icon: 'trash',
    iconClass: 'is-danger',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.DeleteFacet) ||
        userPermissions.includes(Permission.DeleteCatalog),
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
                    notificationService.success(_('catalog.notify-bulk-delete-facets-success'), {
                        count: deletedCount,
                    });
                }
            });
    },
};

export const assignFacetsToChannelBulkAction: BulkAction<GetFacetList.Items, FacetListComponent> = {
    location: 'facet-list',
    label: _('catalog.assign-to-channel'),
    icon: 'layers',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.UpdateFacet) ||
        userPermissions.includes(Permission.UpdateCatalog),
    isVisible: ({ injector }) => isMultiChannel(injector.get(DataService)),
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
                    count: selection.length,
                    channelCode: result.code,
                });
                clearSelection();
            });
    },
};

export const removeFacetsFromChannelBulkAction: BulkAction<GetFacetList.Items, FacetListComponent> = {
    location: 'facet-list',
    label: _('catalog.remove-from-channel'),
    getTranslationVars: ({ injector }) => getChannelCodeFromUserStatus(injector.get(DataService)),
    icon: 'layers',
    iconClass: 'is-warning',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.UpdateFacet) ||
        userPermissions.includes(Permission.UpdateCatalog),
    isVisible: ({ injector }) => currentChannelIsNotDefault(injector.get(DataService)),
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);

        const activeChannelId$ = dataService.client
            .userStatus()
            .mapSingle(({ userStatus }) => userStatus.activeChannelId);

        function showModalAndDelete(facetIds: string[], message?: string) {
            return modalService
                .dialog({
                    title: _('catalog.remove-from-channel'),
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
                            ? activeChannelId$.pipe(
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
                            : EMPTY,
                    ),
                );
        }

        showModalAndDelete(unique(selection.map(f => f.id)))
            .pipe(
                switchMap(result => {
                    let removedCount = selection.length;
                    const errors: string[] = [];
                    const errorIds: string[] = [];
                    let i = 0;
                    for (const item of result) {
                        if (item.__typename === 'FacetInUseError') {
                            errors.push(item.message);
                            errorIds.push(selection[i]?.id);
                            removedCount--;
                        }
                        i++;
                    }
                    if (0 < errorIds.length) {
                        return showModalAndDelete(errorIds, errors.join('\n')).pipe(
                            map(result2 => {
                                const notRemovedCount = result2.filter(
                                    r => r.__typename === 'FacetInUseError',
                                ).length;
                                return selection.length - notRemovedCount;
                            }),
                        );
                    } else {
                        return of(removedCount);
                    }
                }),
                switchMap(removedCount =>
                    removedCount
                        ? getChannelCodeFromUserStatus(dataService).then(({ channelCode }) => ({
                              channelCode,
                              removedCount,
                          }))
                        : EMPTY,
                ),
            )
            .subscribe(({ removedCount, channelCode }) => {
                if (removedCount) {
                    hostComponent.refresh();
                    clearSelection();
                    notificationService.success(_('catalog.notify-remove-facets-from-channel-success'), {
                        count: removedCount,
                        channelCode,
                    });
                }
            });
    },
};
