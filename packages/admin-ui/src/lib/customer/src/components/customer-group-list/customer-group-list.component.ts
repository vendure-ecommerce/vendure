import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DeletionResult,
    GetCustomerGroups,
    GetCustomerGroupsQuery,
    GetCustomerGroupWithCustomers,
    GetZones,
    LogicalOperator,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { SortOrder } from '@vendure/common/lib/generated-shop-types';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    mapTo,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

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
    searchTerm = new FormControl('');
    activeGroup$: Observable<GetCustomerGroups.Items | undefined>;
    activeGroupId: string | undefined;
    listIsEmpty$: Observable<boolean>;
    members$: Observable<GetCustomerGroupWithCustomers.Items[]>;
    membersTotal$: Observable<number>;
    selectedCustomerIds: string[] = [];
    fetchGroupMembers$ = new BehaviorSubject<CustomerGroupMemberFetchParams>({
        skip: 0,
        take: 0,
        filterTerm: '',
    });
    private refreshActiveGroupMembers$ = new BehaviorSubject<void>(undefined);

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        public route: ActivatedRoute,
        protected router: Router,
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
                        name: { contains: this.searchTerm.value },
                    },
                },
            }),
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.searchTerm.valueChanges
            .pipe(
                filter(value => 2 < value.length || value.length === 0),
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
        const activeGroupId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
            tap(() => (this.selectedCustomerIds = [])),
        );
        this.listIsEmpty$ = this.items$.pipe(map(groups => groups.length === 0));
        this.activeGroup$ = combineLatest(this.items$, activeGroupId$).pipe(
            map(([groups, activeGroupId]) => {
                if (activeGroupId) {
                    return groups.find(g => g.id === activeGroupId);
                }
            }),
            tap(val => (this.activeGroupId = val?.id)),
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

    delete(groupId: string) {
        this.modalService
            .dialog({
                title: _('customer.confirm-delete-customer-group'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.dataService.customer.deleteCustomerGroup(groupId) : EMPTY,
                ),

                switchMap(result => {
                    if (result.deleteCustomerGroup.result === DeletionResult.DELETED) {
                        // refresh list
                        return this.dataService.customer
                            .getCustomerGroupList()
                            .mapSingle(() => ({ errorMessage: false }));
                    } else {
                        return of({ errorMessage: result.deleteCustomerGroup.message });
                    }
                }),
            )
            .subscribe(
                result => {
                    if (typeof result.errorMessage === 'string') {
                        this.notificationService.error(result.errorMessage);
                    } else {
                        this.refresh();
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'CustomerGroup',
                        });
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'CustomerGroup',
                    });
                },
            );
    }

    update(group: GetCustomerGroups.Items) {
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

    addToGroup(group: GetCustomerGroupWithCustomers.CustomerGroup) {
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
                    this.selectedCustomerIds = [];
                },
            });
    }

    removeFromGroup(group: GetZones.Zones, customerIds: string[]) {
        this.dataService.customer.removeCustomersFromGroup(group.id, customerIds).subscribe({
            complete: () => {
                this.notificationService.success(_(`customer.remove-customers-from-group-success`), {
                    customerCount: customerIds.length,
                    groupName: group.name,
                });
                this.refreshActiveGroupMembers$.next();
                this.selectedCustomerIds = [];
            },
        });
    }
}
