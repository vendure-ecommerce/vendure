import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    AdministratorFilterParameter,
    AdministratorSortParameter,
    BaseListComponent,
    DataService,
    DataTableService,
    GetAdministratorsQuery,
    ItemOf,
    LogicalOperator,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-administrator-list',
    templateUrl: './administrator-list.component.html',
    styleUrls: ['./administrator-list.component.scss'],
})
export class AdministratorListComponent
    extends BaseListComponent<GetAdministratorsQuery, ItemOf<GetAdministratorsQuery, 'administrators'>>
    implements OnInit
{
    readonly filters = this.dataTableService
        .createFilterCollection<AdministratorFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'firstName',
            type: { kind: 'text' },
            label: _('settings.first-name'),
            filterField: 'firstName',
        })
        .addFilter({
            name: 'lastName',
            type: { kind: 'text' },
            label: _('settings.last-name'),
            filterField: 'lastName',
        })
        .addFilter({
            name: 'emailAddress',
            type: { kind: 'text' },
            label: _('settings.email-address'),
            filterField: 'emailAddress',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<AdministratorSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'lastName' })
        .addSort({ name: 'emailAddress' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.administrator.getAdministrators(...args),
            data => data.administrators,
            (skip, take) => this.createSearchQuery(skip, take, this.searchTermControl.value),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }

    deleteAdministrator(administrator: ItemOf<GetAdministratorsQuery, 'administrators'>) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-administrator'),
                body: `${administrator.firstName} ${administrator.lastName}`,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(res =>
                    res ? this.dataService.administrator.deleteAdministrator(administrator.id) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Administrator',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Administrator',
                    });
                },
            );
    }

    createSearchQuery(skip: number, take: number, searchTerm: string | null) {
        let _filter = {};
        let filterOperator: LogicalOperator = LogicalOperator.AND;

        if (searchTerm) {
            _filter = {
                emailAddress: {
                    contains: searchTerm,
                },
                firstName: {
                    contains: searchTerm,
                },
                lastName: {
                    contains: searchTerm,
                },
            };
            filterOperator = LogicalOperator.OR;
        }
        return {
            options: {
                skip,
                take,
                filter: {
                    ...(_filter ?? {}),
                    ...this.filters.createFilterInput(),
                },
                sort: this.sorts.createSortInput(),
                filterOperator,
            },
        };
    }
}
