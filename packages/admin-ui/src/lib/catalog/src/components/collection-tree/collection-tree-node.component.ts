import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    Optional,
    SimpleChanges,
    SkipSelf,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Permission } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { RootNode, TreeNode } from './array-to-tree';
import { CollectionTreeService } from './collection-tree.service';
import { CollectionPartial } from './collection-tree.types';

@Component({
    selector: 'vdr-collection-tree-node',
    templateUrl: './collection-tree-node.component.html',
    styleUrls: ['./collection-tree-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTreeNodeComponent implements OnInit, OnChanges {
    depth = 0;
    parentName: string;
    @Input() collectionTree: TreeNode<CollectionPartial>;
    @Input() activeCollectionId: string;
    @Input() expandAll = false;
    hasUpdatePermission$: Observable<boolean>;
    hasDeletePermission$: Observable<boolean>;
    moveListItems: Array<{ path: string; id: string }> = [];

    constructor(
        @SkipSelf() @Optional() private parent: CollectionTreeNodeComponent,
        private dataService: DataService,
        private collectionTreeService: CollectionTreeService,
        private router: Router,
        private route: ActivatedRoute,
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
        this.hasUpdatePermission$ = permissions$.pipe(
            map(
                perms =>
                    perms.includes(Permission.UpdateCatalog) || perms.includes(Permission.UpdateCollection),
            ),
        );
        this.hasDeletePermission$ = permissions$.pipe(
            map(
                perms =>
                    perms.includes(Permission.DeleteCatalog) || perms.includes(Permission.DeleteCollection),
            ),
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        const expandAllChange = changes['expandAll'];
        if (expandAllChange) {
            if (expandAllChange.previousValue === true && expandAllChange.currentValue === false) {
                this.collectionTree.children.forEach(c => (c.expanded = false));
            }
        }
    }

    trackByFn(index: number, item: CollectionPartial) {
        return item.id;
    }

    toggleExpanded(collection: TreeNode<CollectionPartial>) {
        collection.expanded = !collection.expanded;
        let expandedIds = this.route.snapshot.queryParamMap.get('expanded')?.split(',') ?? [];
        if (collection.expanded) {
            expandedIds.push(collection.id);
        } else {
            expandedIds = expandedIds.filter(id => id !== collection.id);
        }
        this.router.navigate(['./'], {
            queryParams: {
                expanded: expandedIds.filter(id => !!id).join(','),
            },
            queryParamsHandling: 'merge',
            relativeTo: this.route,
        });
    }

    getMoveListItems(collection: CollectionPartial) {
        this.moveListItems = this.collectionTreeService.getMoveListItems(collection);
    }

    move(collection: CollectionPartial, parentId: string) {
        this.collectionTreeService.onMove({
            index: 0,
            parentId,
            collectionId: collection.id,
        });
    }

    moveUp(collection: CollectionPartial, currentIndex: number) {
        if (!collection.parent) {
            return;
        }
        this.collectionTreeService.onMove({
            index: currentIndex - 1,
            parentId: collection.parent.id,
            collectionId: collection.id,
        });
    }

    moveDown(collection: CollectionPartial, currentIndex: number) {
        if (!collection.parent) {
            return;
        }
        this.collectionTreeService.onMove({
            index: currentIndex + 1,
            parentId: collection.parent.id,
            collectionId: collection.id,
        });
    }

    drop(event: CdkDragDrop<CollectionPartial | RootNode<CollectionPartial>>) {
        moveItemInArray(this.collectionTree.children, event.previousIndex, event.currentIndex);
        this.collectionTreeService.onDrop(event);
    }

    delete(id: string) {
        this.collectionTreeService.onDelete(id);
    }
}
