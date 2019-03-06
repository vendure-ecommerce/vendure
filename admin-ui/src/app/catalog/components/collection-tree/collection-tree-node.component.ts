import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { Collection } from 'shared/generated-types';

import { RootNode, TreeNode } from './array-to-tree';
import { CollectionTreeComponent } from './collection-tree.component';

@Component({
    selector: 'vdr-collection-tree-node',
    templateUrl: './collection-tree-node.component.html',
    styleUrls: ['./collection-tree-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTreeNodeComponent implements OnInit {
    depth = 0;
    parentName: string;
    @Input() collectionTree: TreeNode<Collection.Fragment>;

    constructor(
        @SkipSelf() @Optional() private parent: CollectionTreeNodeComponent,
        private root: CollectionTreeComponent,
    ) {
        if (parent) {
            this.depth = parent.depth + 1;
        }
    }

    ngOnInit() {
        this.parentName = this.collectionTree.name || '<root>';
    }

    getMoveListItems(category: Collection.Fragment): Array<{ path: string; id: string }> {
        const visit = (
            node: TreeNode<any>,
            parentPath: string[],
            output: Array<{ path: string; id: string }>,
        ) => {
            if (node.id !== category.id) {
                const path = parentPath.concat(node.name);
                if (node.id !== category.parent.id) {
                    output.push({ path: path.slice(1).join(' / ') || 'root', id: node.id });
                }
                node.children.forEach(child => visit(child, path, output));
            }
            return output;
        };
        return visit(this.root.categoryTree, [], []);
    }

    move(category: Collection.Fragment, parentId: string) {
        this.root.onMove({
            index: 0,
            parentId,
            collectionId: category.id,
        });
    }

    moveUp(category: Collection.Fragment, currentIndex: number) {
        this.root.onMove({
            index: currentIndex - 1,
            parentId: category.parent.id,
            collectionId: category.id,
        });
    }

    moveDown(category: Collection.Fragment, currentIndex: number) {
        this.root.onMove({
            index: currentIndex + 1,
            parentId: category.parent.id,
            collectionId: category.id,
        });
    }

    drop(event: CdkDragDrop<Collection.Fragment | RootNode<Collection.Fragment>>) {
        this.root.onDrop(event);
    }
}
