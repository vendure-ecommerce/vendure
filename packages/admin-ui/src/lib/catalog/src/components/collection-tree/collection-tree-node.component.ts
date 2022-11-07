import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    SimpleChanges,
    SkipSelf,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Permission, SelectionManager } from '@vendure/admin-ui/core';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { RootNode, TreeNode } from './array-to-tree';
import { CollectionPartial, CollectionTreeComponent } from './collection-tree.component';

@Component({
    selector: 'vdr-collection-tree-node',
    templateUrl: './collection-tree-node.component.html',
    styleUrls: ['./collection-tree-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTreeNodeComponent implements OnInit, OnChanges, OnDestroy {
    depth = 0;
    parentName: string;
    @Input() collectionTree: TreeNode<CollectionPartial>;
    @Input() activeCollectionId: string;
    @Input() expandAll = false;
    @Input() selectionManager: SelectionManager<CollectionPartial>;
    hasUpdatePermission$: Observable<boolean>;
    hasDeletePermission$: Observable<boolean>;
    moveListItems: Array<{ path: string; id: string }> = [];
    private subscription: Subscription;

    constructor(
        @SkipSelf() @Optional() private parent: CollectionTreeNodeComponent,
        private root: CollectionTreeComponent,
        private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
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
        this.subscription = this.selectionManager?.selectionChanges$.subscribe(() =>
            this.changeDetectorRef.markForCheck(),
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

    ngOnDestroy() {
        this.subscription?.unsubscribe();
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
        this.moveListItems = this.root.getMoveListItems(collection);
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
