import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAdministrators } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-administrator-list',
    templateUrl: './administrator-list.component.html',
    styleUrls: ['./administrator-list.component.scss'],
})
export class AdministratorListComponent extends BaseListComponent<
    GetAdministrators.Query,
    GetAdministrators.Items
> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.administrator.getAdministrators(...args),
            data => data.administrators,
        );
    }
}
