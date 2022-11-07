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
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { EMPTY, from, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { AssignToChannelDialogComponent } from '../assign-to-channel-dialog/assign-to-channel-dialog.component';
import { CollectionPartial } from '../collection-tree/collection-tree.component';

import { CollectionListComponent } from './collection-list.component';

export const deleteCollectionsBulkAction: BulkAction<CollectionPartial, CollectionListComponent> = {
    location: 'collection-list',
    label: _('common.delete'),
    icon: 'trash',
    iconClass: 'is-danger',
    requiresPermission: userPermissions =>
        userPermissions.includes(Permission.DeleteCollection) ||
        userPermissions.includes(Permission.DeleteCatalog),
    onClick: ({ injector, selection, hostComponent, clearSelection }) => {
        const modalService = injector.get(ModalService);
        const dataService = injector.get(DataService);
        const notificationService = injector.get(NotificationService);

        modalService
            .dialog({
                title: _('catalog.confirm-bulk-delete-collections'),
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
                        ? dataService.collection.deleteCollections(unique(selection.map(c => c.id)))
                        : EMPTY,
                ),
            )
            .subscribe(result => {
                let deleted = 0;
                const errors: string[] = [];
                for (const item of result.deleteCollections) {
                    if (item.result === DeletionResult.DELETED) {
                        deleted++;
                    } else if (item.message) {
                        errors.push(item.message);
                    }
                }
                if (0 < deleted) {
                    notificationService.success(_('catalog.notify-bulk-delete-collections-success'), {
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

export const assignCollectionsToChannelBulkAction: BulkAction<CollectionPartial, CollectionListComponent> = {
    location: 'collection-list',
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
            .fromComponent(AssignToChannelDialogComponent, {
                size: 'md',
                locals: {},
            })
            .pipe(
                switchMap(result => {
                    if (result) {
                        return dataService.collection
                            .assignCollectionsToChannel({
                                collectionIds: selection.map(c => c.id),
                                channelId: result.id,
                            })
                            .pipe(mapTo(result));
                    } else {
                        return EMPTY;
                    }
                }),
            )
            .subscribe(result => {
                notificationService.success(_('catalog.assign-collections-to-channel-success'), {
                    count: selection.length,
                    channelCode: result.code,
                });
                clearSelection();
            });
    },
};

export const removeCollectionsFromChannelBulkAction: BulkAction<CollectionPartial, CollectionListComponent> =
    {
        location: 'collection-list',
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
                                          ? dataService.collection.removeCollectionsFromChannel({
                                                channelId: activeChannelId,
                                                collectionIds: selection.map(c => c.id),
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
                        notificationService.success(
                            _('catalog.notify-remove-collections-from-channel-success'),
                            {
                                count: selection.length,
                            },
                        );
                        hostComponent.refresh();
                    }
                });
        },
    };
