import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import { GetZones } from '@vendure/admin-ui/core';

import { ZoneMemberControlsDirective } from './zone-member-controls.directive';
import { ZoneMemberListHeaderDirective } from './zone-member-list-header.directive';

export type ZoneMember = { id: string; name: string; code: string };

@Component({
    selector: 'vdr-zone-member-list',
    templateUrl: './zone-member-list.component.html',
    styleUrls: ['./zone-member-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneMemberListComponent {
    @Input() members: ZoneMember[] = [];
    @Input() selectedMemberIds: string[] = [];
    @Output() selectionChange = new EventEmitter<string[]>();
    @ContentChild(ZoneMemberListHeaderDirective) headerTemplate: ZoneMemberListHeaderDirective;
    @ContentChild(ZoneMemberControlsDirective) controlsTemplate: ZoneMemberControlsDirective;
    filterTerm = '';

    filteredMembers(): ZoneMember[] {
        if (this.filterTerm !== '') {
            const term = this.filterTerm.toLocaleLowerCase();
            return this.members.filter(
                m => m.name.toLocaleLowerCase().includes(term) || m.code.toLocaleLowerCase().includes(term),
            );
        } else {
            return this.members;
        }
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
            this.selectionChange.emit(this.members.map(v => v.id));
        }
    }

    toggleSelectMember(member: ZoneMember) {
        if (this.selectedMemberIds.includes(member.id)) {
            this.selectionChange.emit(this.selectedMemberIds.filter(id => id !== member.id));
        } else {
            this.selectionChange.emit([...this.selectedMemberIds, member.id]);
        }
    }

    isMemberSelected = (member: ZoneMember): boolean => {
        return -1 < this.selectedMemberIds.indexOf(member.id);
    };
}
