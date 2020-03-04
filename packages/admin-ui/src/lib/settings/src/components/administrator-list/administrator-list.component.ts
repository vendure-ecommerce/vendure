import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseListComponent } from '@vendure/admin-ui/core';
import { GetAdministrators } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

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
