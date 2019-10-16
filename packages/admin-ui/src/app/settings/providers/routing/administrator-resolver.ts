import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Administrator, Role } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class AdministratorResolver extends BaseEntityResolver<Administrator.Fragment> {
    constructor(private dataService: DataService) {
        super(
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
            id => this.dataService.administrator.getAdministrator(id).mapStream(data => data.administrator),
        );
    }
}
