import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    DataService,
    DeletionResult,
    GetCustomerGroups,
    GetCustomerGroupWithCustomers,
    GetZones,
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
export class CustomerGroupListComponent implements OnInit {
    activeGroup$: Observable<GetCustomerGroups.Items | undefined>;
    groups$: Observable<GetCustomerGroups.Items[]>;
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
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.groups$ = this.dataService.customer
            .getCustomerGroupList()
            .mapStream((data) => data.customerGroups.items);
        const activeGroupId$ = this.route.paramMap.pipe(
            map((pm) => pm.get('contents')),
            distinctUntilChanged(),
            tap(() => (this.selectedCustomerIds = [])),
        );
        this.listIsEmpty$ = this.groups$.pipe(map((groups) => groups.length === 0));
        this.activeGroup$ = combineLatest(this.groups$, activeGroupId$).pipe(
            map(([groups, activeGroupId]) => {
                if (activeGroupId) {
                    return groups.find((g) => g.id === activeGroupId);
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
                        .mapStream((res) => res.customerGroup?.customers);
                } else {
                    return of(undefined);
                }
            }),
        );

        this.members$ = membersResult$.pipe(map((res) => res?.items ?? []));
        this.membersTotal$ = membersResult$.pipe(map((res) => res?.totalItems ?? 0));
    }

    create() {
        this.modalService
            .fromComponent(CustomerGroupDetailDialogComponent, { locals: { group: { name: '' } } })
            .pipe(
                switchMap((name) =>
                    name ? this.dataService.customer.createCustomerGroup({ name, customerIds: [] }) : EMPTY,
                ),
                // refresh list
                switchMap(() => this.dataService.customer.getCustomerGroupList().single$),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'CustomerGroup',
                    });
                },
                (err) => {
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
                switchMap((response) =>
                    response ? this.dataService.customer.deleteCustomerGroup(groupId) : EMPTY,
                ),

                switchMap((result) => {
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
                (result) => {
                    if (typeof result.errorMessage === 'string') {
                        this.notificationService.error(result.errorMessage);
                    } else {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'CustomerGroup',
                        });
                    }
                },
                (err) => {
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
                switchMap((name) =>
                    name ? this.dataService.customer.updateCustomerGroup({ id: group.id, name }) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'CustomerGroup',
                    });
                },
                (err) => {
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
                switchMap((customerIds) =>
                    customerIds
                        ? this.dataService.customer
                              .addCustomersToGroup(group.id, customerIds)
                              .pipe(mapTo(customerIds))
                        : EMPTY,
                ),
            )
            .subscribe({
                next: (result) => {
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
