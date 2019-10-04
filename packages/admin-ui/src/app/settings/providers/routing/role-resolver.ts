import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Role } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class RoleResolver extends BaseEntityResolver<Role.Fragment> {
    constructor(private dataService: DataService) {
        super(
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
            id => this.dataService.administrator.getRole(id).mapStream(data => data.role),
        );
    }
}
