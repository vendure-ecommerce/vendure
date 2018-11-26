import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { scan, startWith, switchMap } from 'rxjs/operators';
import { GetProductCategoryList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';
import { RearrangeEvent } from '../product-category-tree/product-category-tree.component';

@Component({
    selector: 'vdr-product-category-list',
    templateUrl: './product-category-list.component.html',
    styleUrls: ['./product-category-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryListComponent
    extends BaseListComponent<GetProductCategoryList.Query, GetProductCategoryList.Items>
    implements OnInit {
    categories$: Observable<GetProductCategoryList.Items[]>;
    private rearrange = new Subject<RearrangeEvent>();

    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getProductCategories(99999, 0),
            data => data.productCategories,
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.categories$ = this.items$.pipe(
            switchMap(items => {
                return this.rearrange.pipe(
                    startWith({} as any),
                    scan<RearrangeEvent, GetProductCategoryList.Items[]>((acc, event) => {
                        const itemIndex = acc.findIndex(item => item.id === event.categoryId);
                        if (-1 < itemIndex) {
                            let newIndex = 0;
                            if (0 < event.index) {
                                const priorItem = acc.filter(item => item.parent.id === event.parentId)[
                                    event.index - 1
                                ];
                                newIndex = acc.indexOf(priorItem) + 1;
                            }
                            acc[itemIndex].parent = { ...acc[itemIndex].parent, id: event.parentId };
                            acc.splice(newIndex, 0, acc.splice(itemIndex, 1)[0]);
                            return [...acc];
                        }
                        return acc;
                    }, items),
                );
            }),
        );
    }

    onRearrange(event: RearrangeEvent) {
        this.rearrange.next(event);
    }
}
