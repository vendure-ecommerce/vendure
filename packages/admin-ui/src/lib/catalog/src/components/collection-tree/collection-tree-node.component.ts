import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Permission } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

import { RootNode, TreeNode } from './array-to-tree';
import { CollectionPartial, CollectionTreeComponent } from './collection-tree.component';

@Component({
    selector: 'vdr-collection-tree-node',
    templateUrl: './collection-tree-node.component.html',
    styleUrls: ['./collection-tree-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTreeNodeComponent implements OnInit {
    depth = 0;
    parentName: string;
    @Input() collectionTree: TreeNode<CollectionPartial>;
    @Input() activeCollectionId: string;
    @Input() expandAll = false;
    hasUpdatePermission$: Observable<boolean>;
    hasDeletePermission$: Observable<boolean>;

    constructor(
        @SkipSelf() @Optional() private parent: CollectionTreeNodeComponent,
        private root: CollectionTreeComponent,
        private dataService: DataService,
    ) {
        if (parent) {
            this.depth = parent.depth + 1;
        }
    }

    ngOnInit() {
        this.parentName = this.collectionTree.name || '<root>';
        const permissions$ = this.dataService.client
            .userStatus()
            .mapStream(data => data.userStatus.permissions)
            .pipe(shareReplay(1));
        this.hasUpdatePermission$ = permissions$.pipe(map(perms => perms.includes(Permission.UpdateCatalog)));
        this.hasDeletePermission$ = permissions$.pipe(map(perms => perms.includes(Permission.DeleteCatalog)));
    }

    trackByFn(index: number, item: CollectionPartial) {
        return item.id;
    }

    getMoveListItems(collection: CollectionPartial): Array<{ path: string; id: string }> {
        const visit = (
            node: TreeNode<any>,
            parentPath: string[],
            output: Array<{ path: string; id: string }>,
        ) => {
            if (node.id !== collection.id) {
                const path = parentPath.concat(node.name);
                const parentId = collection.parent && collection.parent.id;
                if (node.id !== parentId) {
                    output.push({ path: path.slice(1).join(' / ') || 'root', id: node.id });
                }
                node.children.forEach(child => visit(child, path, output));
            }
            return output;
        };
        return visit(this.root.collectionTree, [], []);
    }

    move(collection: CollectionPartial, parentId: string) {
        this.root.onMove({
            index: 0,
            parentId,
            collectionId: collection.id,
        });
    }

    moveUp(collection: CollectionPartial, currentIndex: number) {
        if (!collection.parent) {
            return;
        }
        this.root.onMove({
            index: currentIndex - 1,
            parentId: collection.parent.id,
            collectionId: collection.id,
        });
    }

    moveDown(collection: CollectionPartial, currentIndex: number) {
        if (!collection.parent) {
            return;
        }
        this.root.onMove({
            index: currentIndex + 1,
            parentId: collection.parent.id,
            collectionId: collection.id,
        });
    }

    drop(event: CdkDragDrop<CollectionPartial | RootNode<CollectionPartial>>) {
        moveItemInArray(this.collectionTree.children, event.previousIndex, event.currentIndex);
        this.root.onDrop(event);
    }

    delete(id: string) {
        this.root.onDelete(id);
    }
}
