import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    ChannelFilterParameter,
    ChannelSortParameter,
    DataService,
    GetChannelsQuery,
    ItemOf,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { EMPTY } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { DataTableService } from '../../../../core/src/providers/data-table/data-table.service';

@Component({
    selector: 'vdr-channel-list',
    templateUrl: './channel-list.component.html',
    styleUrls: ['./channel-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelListComponent
    extends BaseListComponent<GetChannelsQuery, ItemOf<GetChannelsQuery, 'channels'>>
    implements OnInit
{
    readonly filters = this.dataTableService
        .createFilterCollection<ChannelFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'code',
            type: { kind: 'text' },
            label: _('common.code'),
            filterField: 'code',
        })
        .addFilter({
            name: 'token',
            type: { kind: 'text' },
            label: _('settings.channel-token'),
            filterField: 'token',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ChannelSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'code' })
        .addSort({ name: 'token' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        route: ActivatedRoute,
        router: Router,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getChannels(...args).refetchOnChannelChange(),
            data => data.channels,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        code: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }

    isDefaultChannel(channelCode: string): boolean {
        return channelCode === DEFAULT_CHANNEL_CODE;
    }

    deleteChannel(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-channel'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response => (response ? this.dataService.settings.deleteChannel(id) : EMPTY)),
                mergeMap(() => this.dataService.auth.currentUser().single$),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                mergeMap(data => this.dataService.client.updateUserChannels(data.me!.channels)),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Channel',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Channel',
                    });
                },
            );
    }
}
