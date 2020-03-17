import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { combineLatest, EMPTY, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, startWith, switchMap, take, tap } from 'rxjs/operators';

import { Country, DeletionResult, GetCountryList, GetZones, Zone } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';
import { ZoneSelectorDialogComponent } from '../zone-selector-dialog/zone-selector-dialog.component';

@Component({
    selector: 'vdr-country-list',
    templateUrl: './country-list.component.html',
    styleUrls: ['./country-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit, OnDestroy {
    searchTerm = new FormControl('');
    countriesWithZones$: Observable<Array<GetCountryList.Items & { zones: GetZones.Zones[] }>>;
    zones$: Observable<GetZones.Zones[]>;

    selectedCountryIds: string[] = [];
    private countries: GetCountryList.Items[] = [];
    private destroy$ = new Subject();

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {}

    ngOnInit() {
        const countries$ = this.searchTerm.valueChanges.pipe(
            startWith(null),
            switchMap(term => this.dataService.settings.getCountries(9999, 0, term).stream$),
            tap(data => (this.countries = data.countries.items)),
            map(data => data.countries.items),
        );
        this.zones$ = this.dataService.settings.getZones().mapStream(data => data.zones);
        this.countriesWithZones$ = combineLatest(countries$, this.zones$).pipe(
            map(([countries, zones]) => {
                return countries.map(country => ({
                    ...country,
                    zones: zones.filter(z => !!z.members.find(c => c.id === country.id)),
                }));
            }),
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    areAllSelected(): boolean {
        return this.selectedCountryIds.length === this.countries.length;
    }

    toggleSelectAll() {
        if (this.areAllSelected()) {
            this.selectedCountryIds = [];
        } else {
            this.selectedCountryIds = this.countries.map(v => v.id);
        }
    }

    toggleSelectCountry(country: Country.Fragment) {
        const index = this.selectedCountryIds.indexOf(country.id);
        if (-1 < index) {
            this.selectedCountryIds.splice(index, 1);
        } else {
            this.selectedCountryIds.push(country.id);
        }
    }

    isCountrySelected = (country: Country.Fragment): boolean => {
        return -1 < this.selectedCountryIds.indexOf(country.id);
    };

    addCountriesToZone() {
        this.zones$
            .pipe(
                take(1),
                mergeMap(zones => {
                    return this.modalService.fromComponent(ZoneSelectorDialogComponent, {
                        locals: {
                            allZones: zones,
                            canCreateNewZone: true,
                        },
                    });
                }),
                mergeMap(selection => {
                    if (selection && this.isZone(selection)) {
                        return this.dataService.settings
                            .addMembersToZone(selection.id, this.selectedCountryIds)
                            .pipe(map(data => data.addMembersToZone));
                    } else if (selection) {
                        return this.dataService.settings
                            .createZone({
                                name: typeof selection === 'string' ? selection : selection.name,
                                memberIds: this.selectedCountryIds,
                            })
                            .pipe(map(data => data.createZone));
                    } else {
                        return of(undefined);
                    }
                }),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_(`settings.add-countries-to-zone-success`), {
                        countryCount: this.selectedCountryIds.length,
                        zoneName: result.name,
                    });
                    this.selectedCountryIds = [];
                }
            });
    }

    removeCountriesFromZone() {
        this.zones$
            .pipe(
                take(1),
                mergeMap(zones => {
                    return this.modalService.fromComponent(ZoneSelectorDialogComponent, {
                        locals: {
                            allZones: zones,
                            canCreateNewZone: false,
                        },
                    });
                }),
                mergeMap(selection => {
                    if (selection && this.isZone(selection)) {
                        return this.dataService.settings
                            .removeMembersFromZone(selection.id, this.selectedCountryIds)
                            .pipe(map(data => data.removeMembersFromZone));
                    } else {
                        return of(undefined);
                    }
                }),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_(`settings.remove-countries-from-zone-success`), {
                        countryCount: this.selectedCountryIds.length,
                        zoneName: result.name,
                    });
                    this.selectedCountryIds = [];
                }
            });
    }

    deleteCountry(countryId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-country'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.dataService.settings.deleteCountry(countryId) : EMPTY,
                ),
            )
            .subscribe(
                response => {
                    if (response.deleteCountry.result === DeletionResult.DELETED) {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'Country',
                        });
                        this.dataService.settings.getCountries(9999, 0).single$.subscribe();
                    } else {
                        this.notificationService.error(response.deleteCountry.message || '');
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Country',
                    });
                },
            );
    }

    private isZone(input: Zone.Fragment | { name: string } | string): input is Zone.Fragment {
        return input.hasOwnProperty('id');
    }
}
