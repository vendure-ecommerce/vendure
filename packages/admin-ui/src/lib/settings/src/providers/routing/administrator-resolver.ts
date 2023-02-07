import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@uplab/admin-ui/core';
import { Administrator, Role } from '@uplab/admin-ui/core';
import { DataService } from '@uplab/admin-ui/core';

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
