import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

import { Collection } from '@vendure/admin-ui/core';

import { arrayToTree, HasParent, RootNode } from './array-to-tree';

export type RearrangeEvent = { collectionId: string; parentId: string; index: number };
export type CollectionPartial = Pick<Collection.Fragment, 'id' | 'parent' | 'name'>;

@Component({
    selector: 'vdr-collection-tree',
    templateUrl: 'collection-tree.component.html',
    styleUrls: ['./collection-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTreeComponent implements OnChanges {
    @Input() collections: CollectionPartial[];
    @Input() activeCollectionId: string;
    @Input() expandAll = false;
    @Output() rearrange = new EventEmitter<RearrangeEvent>();
    @Output() deleteCollection = new EventEmitter<string>();
    collectionTree: RootNode<CollectionPartial>;

    ngOnChanges(changes: SimpleChanges) {
        if ('collections' in changes && this.collections) {
            this.collectionTree = arrayToTree(this.collections);
        }
    }

    onDrop(event: CdkDragDrop<CollectionPartial | RootNode<CollectionPartial>>) {
        const item = event.item.data as CollectionPartial;
        const newParent = event.container.data;
        const newParentId = newParent.id;
        if (newParentId == null) {
            throw new Error(`Could not determine the ID of the root Collection`);
        }
        this.rearrange.emit({
            collectionId: item.id,
            parentId: newParentId,
            index: event.currentIndex,
        });
    }

    onMove(event: RearrangeEvent) {
        this.rearrange.emit(event);
    }

    onDelete(id: string) {
        this.deleteCollection.emit(id);
    }

    private isRootNode<T extends HasParent>(node: T | RootNode<T>): node is RootNode<T> {
        return !node.hasOwnProperty('parent');
    }
}
