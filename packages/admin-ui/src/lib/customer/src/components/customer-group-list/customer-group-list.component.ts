import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    CustomerGroupFilterParameter,
    CustomerGroupSortParameter,
    DataService,
    DataTableService,
    GetCustomerGroupsQuery,
    GetCustomerGroupWithCustomersQuery,
    ItemOf,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { AddCustomerToGroupDialogComponent } from '../add-customer-to-group-dialog/add-customer-to-group-dialog.component';
import { CustomerGroupDetailDialogComponent } from '../customer-group-detail-dialog/customer-group-detail-dialog.component';
import { CustomerGroupMemberFetchParams } from '../customer-group-member-list/customer-group-member-list.component';

@Component({
    selector: 'vdr-customer-group-list',
    templateUrl: './customer-group-list.component.html',
    styleUrls: ['./customer-group-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGroupListComponent
    extends BaseListComponent<
        GetCustomerGroupsQuery,
        GetCustomerGroupsQuery['customerGroups']['items'][number]
    >
    implements OnInit
{
    activeGroup$: Observable<ItemOf<GetCustomerGroupsQuery, 'customerGroups'> | undefined>;
    activeIndex$: Observable<number>;
    listIsEmpty$: Observable<boolean>;
    members$: Observable<
        NonNullable<GetCustomerGroupWithCustomersQuery['customerGroup']>['customers']['items']
    >;
    membersTotal$: Observable<number>;
    fetchGroupMembers$ = new BehaviorSubject<CustomerGroupMemberFetchParams>({
        skip: 0,
        take: 0,
        filterTerm: '',
    });
    readonly filters = this.dataTableService
        .createFilterCollection<CustomerGroupFilterParameter>()
        .addDateFilters()
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<CustomerGroupSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .connectToRoute(this.route);
    private refreshActiveGroupMembers$ = new BehaviorSubject<void>(undefined);

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        public route: ActivatedRoute,
        protected router: Router,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) =>
                this.dataService.customer.getCustomerGroupList(...args).refetchOnChannelChange(),
            data => data.customerGroups,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: { contains: this.searchTermControl.value },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        const activeGroupId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
        );
        this.listIsEmpty$ = this.items$.pipe(map(groups => groups.length === 0));
        this.activeGroup$ = combineLatest(this.items$, activeGroupId$).pipe(
            map(([groups, activeGroupId]) => {
                if (activeGroupId) {
                    return groups.find(g => g.id === activeGroupId);
                }
            }),
        );
        this.activeIndex$ = combineLatest(this.items$, activeGroupId$).pipe(
            map(([groups, activeGroupId]) => {
                if (activeGroupId) {
                    return groups.findIndex(g => g.id === activeGroupId);
                } else {
                    return -1;
                }
            }),
        );
        const membersResult$ = combineLatest(
            this.activeGroup$,
            this.fetchGroupMembers$,
            this.refreshActiveGroupMembers$,
        ).pipe(
            switchMap(([activeGroup, { skip, take, filterTerm }]) => {
                if (activeGroup) {
                    return this.dataService.customer
                        .getCustomerGroupWithCustomers(activeGroup.id, {
                            skip,
                            take,
                            filter: {
                                emailAddress: {
                                    contains: filterTerm,
                                },
                            },
                        })
                        .mapStream(res => res.customerGroup?.customers);
                } else {
                    return of(undefined);
                }
            }),
        );

        this.members$ = membersResult$.pipe(map(res => res?.items ?? []));
        this.membersTotal$ = membersResult$.pipe(map(res => res?.totalItems ?? 0));

        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }

    create() {
        this.modalService
            .fromComponent(CustomerGroupDetailDialogComponent, { locals: { group: { name: '' } } })
            .pipe(
                switchMap(result =>
                    result
                        ? this.dataService.customer.createCustomerGroup({ ...result, customerIds: [] })
                        : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.refresh();
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'CustomerGroup',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'CustomerGroup',
                    });
                },
            );
    }

    update(group: ItemOf<GetCustomerGroupsQuery, 'customerGroups'>) {
        this.modalService
            .fromComponent(CustomerGroupDetailDialogComponent, { locals: { group } })
            .pipe(
                switchMap(result =>
                    result
                        ? this.dataService.customer.updateCustomerGroup({ id: group.id, ...result })
                        : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.refresh();
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'CustomerGroup',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'CustomerGroup',
                    });
                },
            );
    }

    closeMembers() {
        const params = { ...this.route.snapshot.params };
        delete params.contents;
        this.router.navigate(['./', params], { relativeTo: this.route, queryParamsHandling: 'preserve' });
    }

    addToGroup(group: NonNullable<GetCustomerGroupWithCustomersQuery['customerGroup']>) {
        this.modalService
            .fromComponent(AddCustomerToGroupDialogComponent, {
                locals: {
                    group,
                    route: this.route,
                },
                size: 'md',
                verticalAlign: 'top',
            })
            .pipe(
                switchMap(customerIds =>
                    customerIds
                        ? this.dataService.customer
                              .addCustomersToGroup(group.id, customerIds)
                              .pipe(mapTo(customerIds))
                        : EMPTY,
                ),
            )
            .subscribe({
                next: result => {
                    this.notificationService.success(_(`customer.add-customers-to-group-success`), {
                        customerCount: result.length,
                        groupName: group.name,
                    });
                    this.refreshActiveGroupMembers$.next();
                },
            });
    }
}
