import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetPromotionListQuery,
    ItemOf,
    LogicalOperator,
    PromotionFilterParameter,
    PromotionListOptions,
    PromotionSortParameter,
} from '@vendure/admin-ui/core';

export type PromotionSearchForm = {
    name: string;
    couponCode: string;
};

@Component({
    selector: 'vdr-promotion-list',
    templateUrl: './promotion-list.component.html',
    styleUrls: ['./promotion-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionListComponent
    extends BaseListComponent<GetPromotionListQuery, ItemOf<GetPromotionListQuery, 'promotions'>>
    implements OnInit
{
    readonly filters = this.dataTableService
        .createFilterCollection<PromotionFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'startsAt',
            type: { kind: 'dateRange' },
            label: _('marketing.starts-at'),
            filterField: 'startsAt',
        })
        .addFilter({
            name: 'endsAt',
            type: { kind: 'dateRange' },
            label: _('marketing.ends-at'),
            filterField: 'endsAt',
        })
        .addFilter({
            name: 'enabled',
            type: { kind: 'boolean' },
            label: _('common.enabled'),
            filterField: 'enabled',
        })
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .addFilter({
            name: 'couponCode',
            type: { kind: 'text' },
            label: _('marketing.coupon-code'),
            filterField: 'couponCode',
        })
        .addFilter({
            name: 'desc',
            type: { kind: 'text' },
            label: _('common.description'),
            filterField: 'description',
        })
        .addFilter({
            name: 'usageLimit',
            type: { kind: 'number' },
            label: _('marketing.per-customer-limit'),
            filterField: 'perCustomerUsageLimit',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<PromotionSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'startsAt' })
        .addSort({ name: 'endsAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'couponCode' })
        .addSort({ name: 'perCustomerUsageLimit' })
        .connectToRoute(this.route);

    constructor(
        router: Router,
        route: ActivatedRoute,
        private dataService: DataService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.promotion.getPromotions(...args).refetchOnChannelChange(),
            data => data.promotions,
            (skip, take) => this.createQueryOptions(skip, take, this.searchTermControl.value),
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
    }

    private createQueryOptions(
        skip: number,
        take: number,
        searchTerm: string | null,
    ): { options: PromotionListOptions } {
        const filter = this.filters.createFilterInput();
        const sort = this.sorts.createSortInput();
        let filterOperator = LogicalOperator.AND;
        if (searchTerm) {
            filter.couponCode = { contains: searchTerm };
            filter.name = { contains: searchTerm };
            filterOperator = LogicalOperator.OR;
        }

        return {
            options: {
                skip,
                take,
                filter,
                filterOperator,
                sort,
            },
        };
    }
}
