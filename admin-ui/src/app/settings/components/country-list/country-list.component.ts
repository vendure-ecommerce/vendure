import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCountryList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-country-list',
    templateUrl: './country-list.component.html',
    styleUrls: ['./country-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent extends BaseListComponent<GetCountryList.Query, GetCountryList.Items> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getCountries(...args),
            data => data.countries,
        );
    }
}
