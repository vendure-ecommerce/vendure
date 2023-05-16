import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetSellersQuery,
    ItemOf,
    NavBuilderService,
    SellerFilterParameter,
    SellerSortParameter,
    ServerConfigService,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-seller-list',
    templateUrl: './seller-list.component.html',
    styleUrls: ['./seller-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerListComponent
    extends BaseListComponent<GetSellersQuery, ItemOf<GetSellersQuery, 'sellers'>>
    implements OnInit
{
    readonly customFields = this.serverConfigService.getCustomFieldsFor('Seller');
    readonly filters = this.dataTableService
        .createFilterCollection<SellerFilterParameter>()
        .addDateFilters()
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<SellerSortParameter>()
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
            id: 'create-seller',
            label: _('settings.create-new-seller'),
            locationId: 'seller-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['SuperAdmin', 'CreateSeller'],
        });
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getSellerList(...args).refetchOnChannelChange(),
            data => data.sellers,
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
