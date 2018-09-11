import { Injectable } from '@angular/core';
import { Role } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class RoleResolver extends BaseEntityResolver<Role> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Role' as 'Role',
                id: '',
                code: '',
                description: '',
                permissions: [],
                channels: [],
            },
            id => this.dataService.administrator.getRole(id).mapStream(data => data.role),
        );
    }
}
