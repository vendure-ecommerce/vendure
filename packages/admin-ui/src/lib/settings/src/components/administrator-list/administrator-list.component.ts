import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetAdministrators,
    LogicalOperator,
    ModalService,
    NotificationService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { EMPTY, merge } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'vdr-administrator-list',
    templateUrl: './administrator-list.component.html',
    styleUrls: ['./administrator-list.component.scss'],
})
export class AdministratorListComponent extends BaseListComponent<
    GetAdministrators.Query,
    GetAdministrators.Items
> implements OnInit {
    searchControl = new FormControl('');
    constructor(
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.administrator.getAdministrators(...args),
            (data) => data.administrators,
            (skip, take) => this.createSearchQuery(skip, take, this.searchControl.value)
        );
    }

    ngOnInit() {
        super.ngOnInit();
        const searchTerms$ = merge(this.searchControl.valueChanges).pipe(
            filter(value => 2 < value.length || value.length === 0),
            debounceTime(250),
        );
        merge(searchTerms$, this.route.queryParamMap)
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => {
            this.refresh();
        });
    }

    deleteAdministrator(administrator: GetAdministrators.Items) {
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
                switchMap((res) =>
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
                (err) => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Administrator',
                    });
                },
            );
    }

    createSearchQuery(
        skip: number,
        take: number,
        searchTerm: string) {
        let filter = {};
        let filterOperator: LogicalOperator = LogicalOperator.AND;

        if (searchTerm) {
            filter = {
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
                    ...(filter ?? {}),
                },
                sort: {
                    updatedAt: SortOrder.DESC,
                },
                filterOperator,
            },
        };
    }
}
