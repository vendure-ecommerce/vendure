import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { Role } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class RoleResolver extends BaseEntityResolver<Role.Fragment> {
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
