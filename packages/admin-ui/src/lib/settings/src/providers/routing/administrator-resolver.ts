import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdministratorFragment, BaseEntityResolver, DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class AdministratorResolver extends BaseEntityResolver<AdministratorFragment> {
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
