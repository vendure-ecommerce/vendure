import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetTaxRateListQuery,
    ItemOf,
    NavBuilderService,
    ServerConfigService,
    TaxRateFilterParameter,
    TaxRateSortParameter,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-tax-rate-list',
    templateUrl: './tax-rate-list.component.html',
    styleUrls: ['./tax-rate-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxRateListComponent
    extends BaseListComponent<GetTaxRateListQuery, ItemOf<GetTaxRateListQuery, 'taxRates'>>
    implements OnInit
{
    readonly customFields = this.serverConfigService.getCustomFieldsFor('TaxRate');
    readonly filters = this.dataTableService
        .createFilterCollection<TaxRateFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .addFilter({
            name: 'enabled',
            type: { kind: 'boolean' },
            label: _('common.enabled'),
            filterField: 'enabled',
        })
        .addFilter({
            name: 'value',
            type: { kind: 'number' },
            label: _('common.value'),
            filterField: 'value',
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<TaxRateSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'value' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    constructor(
        router: Router,
        route: ActivatedRoute,
        navBuilderService: NavBuilderService,
        private dataService: DataService,
        private dataTableService: DataTableService,
        private serverConfigService: ServerConfigService,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-tax-rate',
            label: _('settings.create-new-tax-rate'),
            locationId: 'facet-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['CreateSettings', 'CreateTaxRate'],
        });
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getTaxRates(...args),
            data => data.taxRates,
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
