import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetZoneListQuery,
    ItemOf,
    LanguageCode,
    LogicalOperator,
    ModalService,
    NotificationService,
    ServerConfigService,
    ZoneFilterParameter,
    ZoneSortParameter,
} from '@vendure/admin-ui/core';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { distinctUntilChanged, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { AddCountryToZoneDialogComponent } from '../add-country-to-zone-dialog/add-country-to-zone-dialog.component';
import { ZoneDetailDialogComponent } from '../zone-detail-dialog/zone-detail-dialog.component';

@Component({
    selector: 'vdr-zone-list',
    templateUrl: './zone-list.component.html',
    styleUrls: ['./zone-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneListComponent
    extends BaseListComponent<GetZoneListQuery, ItemOf<GetZoneListQuery, 'zones'>>
    implements OnInit
{
    activeZone$: Observable<ItemOf<GetZoneListQuery, 'zones'> | undefined>;
    activeIndex$: Observable<number>;
    members$: Observable<ItemOf<GetZoneListQuery, 'zones'>['members']>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    selectedMemberIds: string[] = [];

    readonly filters = this.dataTableService
        .createFilterCollection<ZoneFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ZoneSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .connectToRoute(this.route);

    constructor(
        route: ActivatedRoute,
        router: Router,
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private serverConfigService: ServerConfigService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getZones(...args).refetchOnChannelChange(),
            data => data.zones,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    filterOperator: this.searchTermControl.value ? LogicalOperator.OR : LogicalOperator.AND,
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        const activeZoneId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
            tap(() => (this.selectedMemberIds = [])),
        );
        this.activeZone$ = combineLatest(this.items$, activeZoneId$).pipe(
            map(([zones, activeZoneId]) => {
                if (activeZoneId) {
                    return zones.find(z => z.id === activeZoneId);
                }
            }),
        );
        this.activeIndex$ = combineLatest(this.items$, activeZoneId$).pipe(
            map(([zones, activeZoneId]) => {
                if (activeZoneId) {
                    return zones.findIndex(g => g.id === activeZoneId);
                } else {
                    return -1;
                }
            }),
        );
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage);
        super.refreshListOnChanges(this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges);
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }

    create() {
        this.modalService
            .fromComponent(ZoneDetailDialogComponent, { locals: { zone: { name: '' } } })
            .pipe(
                switchMap(result =>
                    result ? this.dataService.settings.createZone({ ...result, memberIds: [] }) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Zone',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Zone',
                    });
                },
            );
    }

    update(zone: ItemOf<GetZoneListQuery, 'zones'>) {
        this.modalService
            .fromComponent(ZoneDetailDialogComponent, { locals: { zone } })
            .pipe(
                switchMap(result =>
                    result ? this.dataService.settings.updateZone({ id: zone.id, ...result }) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Zone',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Zone',
                    });
                },
            );
    }

    closeMembers() {
        const params = { ...this.route.snapshot.params };
        delete params.contents;
        this.router.navigate(['./', params], { relativeTo: this.route, queryParamsHandling: 'preserve' });
    }

    addToZone(zone: ItemOf<GetZoneListQuery, 'zones'>) {
        this.modalService
            .fromComponent(AddCountryToZoneDialogComponent, {
                locals: {
                    zoneName: zone.name,
                    currentMembers: zone.members,
                },
                size: 'md',
            })
            .pipe(
                switchMap(memberIds =>
                    memberIds
                        ? this.dataService.settings
                              .addMembersToZone(zone.id, memberIds)
                              .pipe(mapTo(memberIds))
                        : EMPTY,
                ),
            )
            .subscribe({
                next: result => {
                    this.notificationService.success(_(`settings.add-countries-to-zone-success`), {
                        countryCount: result.length,
                        zoneName: zone.name,
                    });
                },
                error: err => {
                    this.notificationService.error(err);
                },
            });
    }
}
