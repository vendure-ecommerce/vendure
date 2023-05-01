import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetFacetListQuery,
    GetRolesQuery,
    ItemOf,
    ModalService,
    NotificationService,
    Role,
    RoleFilterParameter,
    RoleSortParameter,
    SelectionManager,
} from '@vendure/admin-ui/core';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@vendure/common/lib/shared-constants';
import { EMPTY, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil } from 'rxjs/operators';

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
    visibleRoles$: Observable<Array<ItemOf<GetRolesQuery, 'roles'>>>;
    searchTermControl = new FormControl('');
    selectionManager = new SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });

    readonly filters = this.dataTableService
        .createFilterCollection<RoleFilterParameter>()
        .addFilter({
            name: 'createdAt',
            type: { kind: 'dateRange' },
            label: _('common.created-at'),
            filterField: 'createdAt',
        })
        .addFilter({
            name: 'updatedAt',
            type: { kind: 'dateRange' },
            label: _('common.updated-at'),
            filterField: 'updatedAt',
        })
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
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
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
        this.visibleRoles$ = this.items$.pipe(
            map(roles => roles.filter(role => role.code !== CUSTOMER_ROLE_CODE)),
        );
        const searchTerm$ = this.searchTermControl.valueChanges.pipe(
            filter(value => value != null && (2 <= value.length || value.length === 0)),
            debounceTime(250),
        );
        merge(searchTerm$, this.filters.valueChanges, this.sorts.valueChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
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

    deleteRole(id: string) {
        this.modalService
            .dialog({
                title: _('settings.confirm-delete-role'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(switchMap(response => (response ? this.dataService.administrator.deleteRole(id) : EMPTY)))
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Role',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Role',
                    });
                },
            );
    }
}
