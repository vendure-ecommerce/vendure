import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { Administrator, Role } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class AdministratorResolver extends BaseEntityResolver<Administrator.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Administrator' as 'Administrator',
                id: '',
                createdAt: '',
                updatedAt: '',
                emailAddress: '',
                firstName: '',
                lastName: '',
                user: { roles: [] } as any,
            },
            id => dataService.administrator.getAdministrator(id).mapStream(data => data.administrator),
        );
    }
}
