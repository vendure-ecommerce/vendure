import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetTaxCategoriesQuery,
    ItemOf,
    NavBuilderService,
    ServerConfigService,
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
    readonly customFields = this.serverConfigService.getCustomFieldsFor('TaxCategory');
    readonly filters = this.dataTableService
        .createFilterCollection<TaxCategoryFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<TaxCategorySortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    constructor(
        route: ActivatedRoute,
        router: Router,
        navBuilderService: NavBuilderService,
        private dataService: DataService,
        private dataTableService: DataTableService,
        private serverConfigService: ServerConfigService,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-tax-category',
            label: _('settings.create-new-tax-category'),
            locationId: 'tax-category-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['CreateSettings', 'CreateTaxCategory'],
        });
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
