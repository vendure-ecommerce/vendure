import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetSellersQuery,
    ItemOf,
    SellerFilterParameter,
    SellerSortParameter,
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
    readonly filters = this.dataTableService
        .createFilterCollection<SellerFilterParameter>()
        .addDateFilters()
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<SellerSortParameter>()
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
