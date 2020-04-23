import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Country,
    DataService,
    DeletionResult,
    GetZones,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';

import { AddCountryToZoneDialogComponent } from '../add-country-to-zone-dialog/add-country-to-zone-dialog.component';
import { ZoneDetailDialogComponent } from '../zone-detail-dialog/zone-detail-dialog.component';

@Component({
    selector: 'vdr-zone-list',
    templateUrl: './zone-list.component.html',
    styleUrls: ['./zone-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneListComponent implements OnInit {
    activeZone$: Observable<GetZones.Zones | undefined>;
    zones$: Observable<GetZones.Zones[]>;
    members$: Observable<GetZones.Members[]>;
    selectedMemberIds: string[] = [];

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.zones$ = this.dataService.settings.getZones().mapStream(data => data.zones);
        const activeZoneId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
            tap(() => (this.selectedMemberIds = [])),
        );
        this.activeZone$ = combineLatest(this.zones$, activeZoneId$).pipe(
            map(([zones, activeZoneId]) => {
                if (activeZoneId) {
                    return zones.find(z => z.id === activeZoneId);
                }
            }),
        );
    }

    create() {
        this.modalService
            .fromComponent(ZoneDetailDialogComponent, { locals: { zone: { name: '' } } })
            .pipe(
                switchMap(name =>
                    name ? this.dataService.settings.createZone({ name, memberIds: [] }) : EMPTY,
                ),
                // refresh list
                switchMap(() => this.dataService.settings.getZones().single$),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Zone',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Zone',
                    });
                },
            );
    }

    delete(zoneId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-zone'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response => (response ? this.dataService.settings.deleteZone(zoneId) : EMPTY)),

                switchMap(result => {
                    if (result.deleteZone.result === DeletionResult.DELETED) {
                        // refresh list
                        return this.dataService.settings
                            .getZones()
                            .mapSingle(() => ({ errorMessage: false }));
                    } else {
                        return of({ errorMessage: result.deleteZone.message });
                    }
                }),
            )
            .subscribe(
                result => {
                    if (typeof result.errorMessage === 'string') {
                        this.notificationService.error(result.errorMessage);
                    } else {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'Zone',
                        });
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Zone',
                    });
                },
            );
    }

    update(zone: GetZones.Zones) {
        this.modalService
            .fromComponent(ZoneDetailDialogComponent, { locals: { zone } })
            .pipe(
                switchMap(name =>
                    name ? this.dataService.settings.updateZone({ id: zone.id, name }) : EMPTY,
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

    addToZone(zone: GetZones.Zones) {
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

    removeFromZone(zone: GetZones.Zones, memberIds: string[]) {
        this.dataService.settings.removeMembersFromZone(zone.id, memberIds).subscribe({
            complete: () => {
                this.notificationService.success(_(`settings.remove-countries-from-zone-success`), {
                    countryCount: memberIds.length,
                    zoneName: zone.name,
                });
            },
        });
    }
}
