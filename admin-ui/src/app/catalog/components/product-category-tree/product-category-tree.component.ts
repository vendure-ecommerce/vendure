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
import { ProductCategory } from 'shared/generated-types';

import { arrayToTree, HasParent, RootNode } from './array-to-tree';

export type RearrangeEvent = { categoryId: string; parentId: string; index: number };

@Component({
    selector: 'vdr-product-category-tree',
    templateUrl: 'product-category-tree.component.html',
    styleUrls: ['./product-category-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryTreeComponent implements OnChanges {
    @Input() productCategories: ProductCategory.Fragment[];
    @Output() rearrange = new EventEmitter<RearrangeEvent>();
    categoryTree: RootNode<ProductCategory.Fragment>;

    ngOnChanges(changes: SimpleChanges) {
        if ('productCategories' in changes && this.productCategories) {
            this.categoryTree = arrayToTree(this.productCategories);
        }
    }

    onDrop(event: CdkDragDrop<ProductCategory.Fragment | RootNode<ProductCategory.Fragment>>) {
        const item = event.item.data as ProductCategory.Fragment;
        const newParent = event.container.data;
        const newParentId = newParent.id;
        if (newParentId == null) {
            throw new Error(`Could not determine the ID of the root ProductCategory`);
        }
        this.rearrange.emit({
            categoryId: item.id,
            parentId: newParentId,
            index: event.currentIndex,
        });
    }

    onMove(event: RearrangeEvent) {
        this.rearrange.emit(event);
    }

    private isRootNode<T extends HasParent>(node: T | RootNode<T>): node is RootNode<T> {
        return !node.hasOwnProperty('parent');
    }
}
