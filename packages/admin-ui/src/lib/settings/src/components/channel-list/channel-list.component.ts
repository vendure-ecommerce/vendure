import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    ChannelFilterParameter,
    ChannelSortParameter,
    DataService,
    GetChannelsQuery,
    GetFacetListQuery,
    ItemOf,
    ModalService,
    NotificationService,
    SelectionManager,
} from '@vendure/admin-ui/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { EMPTY, merge } from 'rxjs';
import { debounceTime, filter, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
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
    searchTermControl = new FormControl('');
    selectionManager = new SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });

    readonly filters = this.dataTableService
        .createFilterCollection<ChannelFilterParameter>()
        .addFilter({
            name: 'createdAt',
            type: { kind: 'dateRange' },
            label: _('common.created-at'),
            filterField: 'createdAt',
        })
        .addFilter({
            name: 'updatedAt',
            type: { kind: 'dateRange' },
            label: _('common.updated-at'),
            filterField: 'updatedAt',
        })
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
        const searchTerm$ = this.searchTermControl.valueChanges.pipe(
            filter(value => value != null && (2 <= value.length || value.length === 0)),
            debounceTime(250),
        );
        merge(searchTerm$, this.filters.valueChanges, this.sorts.valueChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
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
