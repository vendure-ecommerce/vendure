import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BulkActionLocationId, GetZoneListQuery, ItemOf, SelectionManager } from '@vendure/admin-ui/core';
import { Observable, Subject, switchMap } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { ZoneMemberControlsDirective } from './zone-member-controls.directive';
import { ZoneMemberListHeaderDirective } from './zone-member-list-header.directive';

export type ZoneMember = { id: string; name: string; code: string };

@Component({
    selector: 'vdr-zone-member-list',
    templateUrl: './zone-member-list.component.html',
    styleUrls: ['./zone-member-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneMemberListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() locationId: BulkActionLocationId;
    @Input() members: ZoneMember[] = [];
    @Input() selectedMemberIds: string[] = [];
    @Input() activeZone: ItemOf<GetZoneListQuery, 'zones'>;
    @Output() selectionChange = new EventEmitter<string[]>();
    @ContentChild(ZoneMemberListHeaderDirective) headerTemplate: ZoneMemberListHeaderDirective;
    @ContentChild(ZoneMemberControlsDirective) controlsTemplate: ZoneMemberControlsDirective;
    filterTermControl = new FormControl('');
    filteredMembers$: Observable<ZoneMember[]>;
    totalItems$: Observable<number>;
    currentPage = 1;
    itemsPerPage = 10;
    selectionManager = new SelectionManager<ZoneMember>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });
    private members$ = new Subject<ZoneMember[]>();
    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.selectionManager.setCurrentItems(
            this.members?.filter(m => this.selectedMemberIds.includes(m.id)) ?? [],
        );
        this.selectionManager.selectionChanges$.pipe(takeUntil(this.destroy$)).subscribe(selection => {
            this.selectionChange.emit(selection.map(s => s.id));
        });
        this.filteredMembers$ = this.members$.pipe(
            startWith(this.members),
            switchMap(() => this.filterTermControl.valueChanges.pipe(startWith(''))),
            map(filterTerm => {
                if (filterTerm) {
                    const term = filterTerm?.toLocaleLowerCase() ?? '';
                    return this.members.filter(
                        m =>
                            m.name.toLocaleLowerCase().includes(term) ||
                            m.code.toLocaleLowerCase().includes(term),
                    );
                } else {
                    return this.members;
                }
            }),
        );
        this.totalItems$ = this.filteredMembers$.pipe(map(members => members.length));
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('members' in changes) {
            this.members$.next(this.members);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
