import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, DataService, GetCustomerGroupWithCustomers } from '@vendure/admin-ui/core';
import { ZoneMember } from '@vendure/admin-ui/settings';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs/operators';

export interface CustomerGroupMemberFetchParams {
    skip: number;
    take: number;
    filterTerm: string;
}

@Component({
    selector: 'vdr-customer-group-member-list',
    templateUrl: './customer-group-member-list.component.html',
    styleUrls: ['./customer-group-member-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGroupMemberListComponent implements OnInit, OnDestroy {
    @Input() members: Array<
        Pick<Customer, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'firstName' | 'lastName' | 'emailAddress'>
    >;
    @Input() totalItems: number;
    @Input() route: ActivatedRoute;
    @Input() selectedMemberIds: string[] = [];
    @Output() selectionChange = new EventEmitter<string[]>();
    @Output() fetchParamsChange = new EventEmitter<CustomerGroupMemberFetchParams>();

    membersItemsPerPage$: Observable<number>;
    membersCurrentPage$: Observable<number>;
    filterTermControl = new FormControl('');
    private refresh$ = new BehaviorSubject<boolean>(true);
    private destroy$ = new Subject<void>();

    constructor(private router: Router, private dataService: DataService) {}

    ngOnInit() {
        this.membersCurrentPage$ = this.route.paramMap.pipe(
            map((qpm) => qpm.get('membersPage')),
            map((page) => (!page ? 1 : +page)),
            startWith(1),
            distinctUntilChanged(),
        );

        this.membersItemsPerPage$ = this.route.paramMap.pipe(
            map((qpm) => qpm.get('membersPerPage')),
            map((perPage) => (!perPage ? 10 : +perPage)),
            startWith(10),
            distinctUntilChanged(),
        );

        const filterTerm$ = this.filterTermControl.valueChanges.pipe(
            debounceTime(250),
            tap(() => this.setContentsPageNumber(1)),
            startWith(''),
        );

        combineLatest(this.membersCurrentPage$, this.membersItemsPerPage$, filterTerm$, this.refresh$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([currentPage, itemsPerPage, filterTerm]) => {
                const take = itemsPerPage;
                const skip = (currentPage - 1) * itemsPerPage;
                this.fetchParamsChange.emit({
                    filterTerm,
                    skip,
                    take,
                });
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setContentsPageNumber(page: number) {
        this.setParam('membersPage', page);
    }

    setContentsItemsPerPage(perPage: number) {
        this.setParam('membersPerPage', perPage);
    }

    refresh() {
        this.refresh$.next(true);
    }

    private setParam(key: string, value: any) {
        this.router.navigate(['./', { ...this.route.snapshot.params, [key]: value }], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }

    areAllSelected(): boolean {
        if (this.members) {
            return this.selectedMemberIds.length === this.members.length;
        } else {
            return false;
        }
    }

    toggleSelectAll() {
        if (this.areAllSelected()) {
            this.selectionChange.emit([]);
        } else {
            this.selectionChange.emit(this.members.map((v) => v.id));
        }
    }

    toggleSelectMember(member: ZoneMember) {
        if (this.selectedMemberIds.includes(member.id)) {
            this.selectionChange.emit(this.selectedMemberIds.filter((id) => id !== member.id));
        } else {
            this.selectionChange.emit([...this.selectedMemberIds, member.id]);
        }
    }

    isMemberSelected = (member: ZoneMember): boolean => {
        return -1 < this.selectedMemberIds.indexOf(member.id);
    };
}
