import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    AdministratorFilterParameter,
    AdministratorSortParameter,
    BaseListComponent,
    DataService,
    GetAdministratorsQuery,
    GetFacetListQuery,
    ItemOf,
    LogicalOperator,
    ModalService,
    NotificationService,
    SelectionManager,
    SellerFilterParameter,
    SellerSortParameter,
    SortOrder,
} from '@vendure/admin-ui/core';
import { EMPTY, merge } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { DataTableService } from '../../../../core/src/providers/data-table/data-table.service';

@Component({
    selector: 'vdr-administrator-list',
    templateUrl: './administrator-list.component.html',
    styleUrls: ['./administrator-list.component.scss'],
})
export class AdministratorListComponent
    extends BaseListComponent<GetAdministratorsQuery, ItemOf<GetAdministratorsQuery, 'administrators'>>
    implements OnInit
{
    searchTermControl = new FormControl('');
    selectionManager = new SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });
    readonly filters = this.dataTableService
        .createFilterCollection<AdministratorFilterParameter>()
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
        const searchTerms$ = merge(this.searchTermControl.valueChanges).pipe(
            filter(value => (value && 2 < value.length) || value?.length === 0),
            debounceTime(250),
        );
        merge(searchTerms$, this.filters.valueChanges, this.sorts.valueChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => {
                this.refresh();
            });
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
