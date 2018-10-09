import { Injectable } from '@angular/core';
import { Administrator, Role } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class AdministratorResolver extends BaseEntityResolver<Administrator.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Administrator' as 'Administrator',
                id: '',
                emailAddress: '',
                firstName: '',
                lastName: '',
                user: { roles: [] } as any,
            },
            id => this.dataService.administrator.getAdministrator(id).mapStream(data => data.administrator),
        );
    }
}
