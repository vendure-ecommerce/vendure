import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataService, Dialog, GetCountryList, GetZones } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'vdr-add-country-to-zone-dialog',
    templateUrl: './add-country-to-zone-dialog.component.html',
    styleUrls: ['./add-country-to-zone-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCountryToZoneDialogComponent implements Dialog<string[]>, OnInit {
    resolveWith: (result?: string[]) => void;
    zoneName: string;
    currentMembers: GetZones.Members[] = [];
    availableCountries$: Observable<GetCountryList.Items[]>;
    selectedMemberIds: string[] = [];

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        const currentMemberIds = this.currentMembers.map(m => m.id);
        this.availableCountries$ = this.dataService.settings
            .getCountries(999)
            .mapStream(data => data.countries.items)
            .pipe(map(countries => countries.filter(c => !currentMemberIds.includes(c.id))));
    }

    cancel() {
        this.resolveWith();
    }

    add() {
        this.resolveWith(this.selectedMemberIds);
    }
}
