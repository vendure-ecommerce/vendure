import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Role } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
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
