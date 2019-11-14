import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Administrator, Role } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
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
