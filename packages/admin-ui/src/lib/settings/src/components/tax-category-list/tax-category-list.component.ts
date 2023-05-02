import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetTaxCategoriesQuery,
    ItemOf,
    TaxCategoryFilterParameter,
    TaxCategorySortParameter,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-tax-list',
    templateUrl: './tax-category-list.component.html',
    styleUrls: ['./tax-category-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCategoryListComponent
    extends BaseListComponent<GetTaxCategoriesQuery, ItemOf<GetTaxCategoriesQuery, 'taxCategories'>>
    implements OnInit
{
    readonly filters = this.dataTableService
        .createFilterCollection<TaxCategoryFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<TaxCategorySortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .connectToRoute(this.route);

    constructor(
        route: ActivatedRoute,
        router: Router,
        private dataService: DataService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getTaxCategories(...args),
            data => data.taxCategories,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }
}
