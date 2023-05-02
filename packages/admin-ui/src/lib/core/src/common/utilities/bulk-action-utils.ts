import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { lastValueFrom, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../data/providers/data.service';
import { BulkAction } from '../../providers/bulk-action-registry/bulk-action-types';
import { ModalService } from '../../providers/modal/modal.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { BaseListComponent } from '../base-list.component';
import { DeletionResponse, DeletionResult } from '../generated-types';

/**
 * @description
 * Resolves to an object containing the Channel code of the given channelId, or if no channelId
 * is supplied, the code of the activeChannel.
 */
export function getChannelCodeFromUserStatus(dataService: DataService, channelId?: string) {
    return lastValueFrom(
        dataService.client.userStatus().mapSingle(({ userStatus }) => {
            const channelCode =
                userStatus.channels.find(c => c.id === (channelId ?? userStatus.activeChannelId))?.code ??
                'undefined';
            return { channelCode };
        }),
    );
}

/**
 * @description
 * Resolves to `true` if multiple Channels are set up.
 */
export function isMultiChannel(dataService: DataService) {
    return lastValueFrom(
        dataService.client.userStatus().mapSingle(({ userStatus }) => 1 < userStatus.channels.length),
    );
}

/**
 * @description
 * Resolves to `true` if the current active Channel is not the default Channel.
 */
export function currentChannelIsNotDefault(dataService: DataService) {
    return lastValueFrom(
        dataService.client.userStatus().mapSingle(({ userStatus }) => {
            if (userStatus.channels.length === 1) {
                return false;
            }
            const defaultChannelId = userStatus.channels.find(c => c.code === DEFAULT_CHANNEL_CODE)?.id;
            return userStatus.activeChannelId !== defaultChannelId;
        }),
    );
}

export type CreateBulkDeleteActionConfig<ItemType> = Pick<BulkAction, 'location' | 'requiresPermission'> & {
    getItemName: (item: ItemType) => string;
    shouldRetryItem?: (response: DeletionResponse, item: ItemType) => boolean;
    bulkDelete: (
        dataService: DataService,
        ids: string[],
        retrying: boolean,
    ) => Observable<DeletionResponse[]>;
};

/**
 * @description
 * Creates a BulkAction which can be used to delete multiple items.
 */
export function createBulkDeleteAction<ItemType>(config: CreateBulkDeleteActionConfig<ItemType>) {
    const bulkDeleteAction: BulkAction<any, BaseListComponent<any, any>> = {
        location: config.location,
        label: _('common.delete'),
        icon: 'trash',
        iconClass: 'is-danger',
        requiresPermission: config.requiresPermission,
        onClick: ({ injector, selection, hostComponent, clearSelection }) => {
            const modalService = injector.get(ModalService);
            const dataService = injector.get(DataService);
            const notificationService = injector.get(NotificationService);

            function showModalAndDelete(items: ItemType[], message?: string) {
                const itemNames = items
                    .slice(0, 5)
                    .map(c => config.getItemName(c))
                    .join(', ');
                const nMore = items.length > 5 ? items.length - 5 : 0;
                return modalService
                    .dialog({
                        title: _('catalog.confirm-bulk-delete'),
                        body: message ? message : nMore ? _('common.list-items-and-n-more') : itemNames,
                        translationVars: { items: itemNames, nMore },
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
                                ? config.bulkDelete(
                                      dataService,
                                      selection.map(c => c.id),
                                      message != null,
                                  )
                                : of([]),
                        ),
                    );
            }

            showModalAndDelete(selection)
                .pipe(
                    switchMap(result => {
                        let deletedCount = 0;
                        const errors: Array<{ item: ItemType; message: string }> = [];
                        let i = 0;
                        for (const item of result) {
                            if (item.result === DeletionResult.DELETED) {
                                deletedCount++;
                            } else if (config.shouldRetryItem?.(result[i], selection[i])) {
                                errors.push({ item: selection[i], message: item.message ?? '' });
                            }
                            i++;
                        }
                        if (0 < errors.length) {
                            return showModalAndDelete(
                                errors.map(e => e.item),
                                errors.map(e => e.message).join('\n'),
                            ).pipe(
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
                        notificationService.success(_('catalog.notify-delete-success-with-count'), {
                            count: deletedCount,
                        });
                    }
                    const notDeletedCount = selection.length - deletedCount;
                    if (0 < notDeletedCount && notDeletedCount < selection.length) {
                        notificationService.error(_('catalog.notify-delete-error-with-count'), {
                            count: notDeletedCount,
                        });
                    }
                });
        },
    };
    return bulkDeleteAction;
}
