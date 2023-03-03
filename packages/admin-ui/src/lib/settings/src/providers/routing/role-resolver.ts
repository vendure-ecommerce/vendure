import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, RoleFragment } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class RoleResolver extends BaseEntityResolver<RoleFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Role' as 'Role',
                id: '',
                createdAt: '',
                updatedAt: '',
                code: '',
                description: '',
                permissions: [],
                channels: [],
            },
            id => dataService.administrator.getRole(id).mapStream(data => data.role),
        );
    }
}
