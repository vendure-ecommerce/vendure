import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetRolesQuery,
    ItemOf,
    NavBuilderService,
    Role,
    RoleFilterParameter,
    RoleSortParameter,
} from '@vendure/admin-ui/core';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@vendure/common/lib/shared-constants';

@Component({
    selector: 'vdr-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent
    extends BaseListComponent<GetRolesQuery, ItemOf<GetRolesQuery, 'roles'>>
    implements OnInit
{
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};
    readonly filters = this.dataTableService
        .createFilterCollection<RoleFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'code',
            type: { kind: 'text' },
            label: _('common.code'),
            filterField: 'code',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<RoleSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'code' })
        .addSort({ name: 'description' })
        .connectToRoute(this.route);

    constructor(
        router: Router,
        route: ActivatedRoute,
        navBuilderService: NavBuilderService,
        private dataService: DataService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-role',
            label: _('settings.create-new-role'),
            locationId: 'role-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['CreateAdministrator'],
        });
        super.setQueryFn(
            (...args: any[]) => this.dataService.administrator.getRoles(...args),
            data => data.roles,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        code: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }

    toggleDisplayLimit(role: ItemOf<GetRolesQuery, 'roles'>) {
        if (this.displayLimit[role.id] === role.permissions.length) {
            this.displayLimit[role.id] = this.initialLimit;
        } else {
            this.displayLimit[role.id] = role.permissions.length;
        }
    }

    isDefaultRole(role: Role): boolean {
        return role.code === SUPER_ADMIN_ROLE_CODE || role.code === CUSTOMER_ROLE_CODE;
    }
}
