import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { GetTagList } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { Dialog } from '../../../providers/modal/modal.service';

@Component({
    selector: 'vdr-manage-tags-dialog',
    templateUrl: './manage-tags-dialog.component.html',
    styleUrls: ['./manage-tags-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTagsDialogComponent implements Dialog<boolean>, OnInit {
    resolveWith: (result: boolean | undefined) => void;
    allTags$: Observable<GetTagList.Items[]>;
    toDelete: string[] = [];
    toUpdate: Array<{ id: string; value: string }> = [];

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.allTags$ = this.dataService.product.getTagList().mapStream(data => data.tags.items);
    }

    toggleDelete(id: string) {
        const marked = this.markedAsDeleted(id);
        if (marked) {
            this.toDelete = this.toDelete.filter(_id => _id !== id);
        } else {
            this.toDelete.push(id);
        }
    }

    markedAsDeleted(id: string): boolean {
        return this.toDelete.includes(id);
    }

    updateTagValue(id: string, value: string) {
        const exists = this.toUpdate.find(i => i.id === id);
        if (exists) {
            exists.value = value;
        } else {
            this.toUpdate.push({ id, value });
        }
    }

    saveChanges() {
        const operations: Array<Observable<any>> = [];
        for (const id of this.toDelete) {
            operations.push(this.dataService.product.deleteTag(id));
        }
        for (const item of this.toUpdate) {
            if (!this.toDelete.includes(item.id)) {
                operations.push(this.dataService.product.updateTag(item));
            }
        }
        return forkJoin(operations).subscribe(() => this.resolveWith(true));
    }
}
